import { InstanceBase, InstanceStatus, runEntrypoint, TCPHelper } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { getActionDefinitions } from './actions.js'
import { initFeedbacks } from './feedbacks.js'
import { initPresets } from './presets.js'

class ExtronMMXInstance extends InstanceBase {
	async init(config) {
		this.config = config
		this.muteStates = [
			  [0, 0, 0],
			  [0, 0, 0],
			  [0, 0, 0]
			];
		this.routingMatrix = [
			  [0, 0, 0],
			  [0, 0, 0],
			  [0, 0, 0]
			];
		this.audioIn = 1
		this.audioLevel = [0, 0, 0, 0, 0];
		this.lock = ''
		this.INPUT = [
			{ id: '1', label: 'In 1' },
			{ id: '2', label: 'In 2' },
			{ id: '3', label: 'In 3' },
			{ id: '4', label: "In 4" },
		]
		this.OUTPUT = [
			{ id: '1', label: 'Out 1' },
			{ id: '2', label: 'Out 2' },
		]

		this.setActionDefinitions(getActionDefinitions(this))
		this.setFeedbackDefinitions(initFeedbacks(this));

		await this.configUpdated(config)
	}

	async configUpdated(config) {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.config = config
		this.setPresetDefinitions(initPresets(this));
		this.init_tcp()
		this.init_tcp_variables()
		this.getMatrixConfig()
	}

	async destroy() {
		if (this.socket) {
			this.socket.destroy()
		} else {
			this.updateStatus(InstanceStatus.Disconnected)
		}
	}

	getConfigFields() {
		return ConfigFields
	}

	init_tcp() {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
			this.socketBuffer = '' // Buffer for incoming data
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})

			this.socket.on('data', (data) => {
				//this.log('debug', 'received chunk: ' + data)
				
				if (typeof this.socketBuffer === 'undefined') {	// make sure the buffer is initialized
					this.socketBuffer = '';
				}
				
				this.socketBuffer += data.toString()			// Save data as string (if it comes in as buffer)
				let parts = this.socketBuffer.split(/\r\n/)		// check if response is complete
				while (parts.length > 1) {
					let completeMessage = parts.shift().trim()	// process first message
					this.log('debug', 'response: ' + completeMessage)
			
					if (this.config.saveresponse) {
						this.setVariableValues({ tcp_response: completeMessage })
						this.parseResponse(completeMessage)
					}
				}
				
				this.socketBuffer = parts[0] || ''				// keep incomplete response in buffer
				//this.socketBuffer = parts.length > 0 ? parts[0] : '';				// keep incomplete response in buffer
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	init_tcp_variables() {
		// Collect variable definitions in an array
		let variableDefinitions = [{
			name: 'Last TCP Response',
			variableId: 'tcp_response'
		}];
		let variableValues = {
			tcp_response: ''
		};
		
		// Frontpanel
		variableDefinitions.push({
				name: 'Frontpanel Lock State',
				variableId: 'FrontPanelLock'
			});
			variableValues['FrontPanelLock'] = ''
	
		// Loop to define Audio Level variables and set their values
		for (let input = 1; input <= parseInt(this.INPUT.length); input++) {
			variableDefinitions.push({
				name: `Audio Level Input${input}`,
				variableId: `AudioLevelIn${input}`
			});
			variableValues[`AudioLevelIn${input}`] = '';  // Set initial value
		}
	
		// Set all variable definitions at once
		this.setVariableDefinitions(variableDefinitions);
		this.setVariableValues(variableValues);
	}
	
	async getMatrixConfig() {
		await this.waitForSocketConnection();	// waits until socket ist connected
		
		this.log('debug', 'sending get commands and check feedbacks')
		if (this.socket !== undefined && this.socket.isConnected) {
			this.socket.send('01G')	// Audio Level In1: +03
			this.socket.send('02G')	// Audio Level In2: -03
			this.socket.send('03G')	// Audio Level In3: +03
			this.socket.send('04G')	// Audio Level In4: +07
			this.socket.send('I')	// AV routes and mutes: V1*04 A1*02 V2*04 A2*03 Vmt1*0 Amt1*0 Vmt2*0 Amt2*0
			this.socket.send('X')	// frontpanel lock: 0/1
			this.checkFeedbacks('audio_level');
			this.checkFeedbacks('routing_status');
			this.checkFeedbacks('lock_status');
		} else {
			this.log('debug', 'Socket not connected :(')
		}
	}
	
	// function that waits until socket is connected
	waitForSocketConnection() {
		return new Promise((resolve, reject) => {
			const checkConnection = () => {
				if (this.socket !== undefined && this.socket.isConnected) {
					resolve();
				} else {
					setTimeout(checkConnection, 500);
				}
			};
	
			checkConnection();
		});
	}

	parseResponse(response) {
		// **Muting Matrix**:
		// Video Mutes: Vmt[Out]*[1/0]  global: Vmt[1/0]
		// Audio Mutes: Amt[Out]*[1/0]  global: Amt[1/0]
		const muteMatch = response.match(/^([VA])mt(\d{1,2})(?:\*(\d))?/);
		let col = 0
		
		if (muteMatch) {
			//this.log('debug', 'mute: ' + muteMatch[1])	// A or V
			//this.log('debug', 'mute: ' + muteMatch[2])	// 1/0 for global on/off if muteMatch[3] = undefined else Out number
			//this.log('debug', 'mute: ' + muteMatch[3])	// 1/0 for on/off
			switch(muteMatch[1]) {
				case 'A':
					col = 1
					break;
				case 'V':
					col = 2
					break;
			}
			if (muteMatch[3] === undefined) {			// Global mute
				for (let out = 1; out <= parseInt(this.OUTPUT.length); out++) {
					//this.log('debug', 'out: ' + out)
					//this.log('debug', 'col: ' + col)
					//this.log('debug', 'status: ' + muteMatch[2])
					this.muteStates[out][parseInt(col)] = parseInt(muteMatch[2]);
				}
			} else {									// Output mute
				this.muteStates[parseInt(muteMatch[2])][col] = parseInt(muteMatch[3]);
			}
			
			this.muteStates = transformMatrix(this.muteStates);
			
			this.log('debug', 'Mute Matrix: ' + JSON.stringify(this.muteStates))
			this.checkFeedbacks('mute_status')
		}
		
		// **Routing Matrix**:
		// Out01 In02 All
		// Out02 In04 Aud
		// Out01 In01 Vid
		const routeMatch = response.match(/^Out(\d+) In(\d+) (\w+)$/);
		if (routeMatch) {
			let output = parseInt(routeMatch[1]);  // Output number
			let input = parseInt(routeMatch[2]);   // Input number
			let type = routeMatch[3];              // route type (All, Aud, Vid)
	
			switch(type) {
				case 'Aud': col = 1; break;
				case 'Vid': col = 2; break;
				case 'All': col = 3; break;
			}
			if (col === 3) {
				for (let col = 1; col <= 2; col++) {
					this.routingMatrix[output][col] = input; // save route
				}
			} else {
				this.routingMatrix[output][col] = input; // save route
			}
			
			this.routingMatrix = transformMatrix(this.routingMatrix);
			
			this.log('debug', 'Routing Matrix: ' + JSON.stringify(this.routingMatrix));
			this.checkFeedbacks('routing_status');
		}
		
		// **Audio Level**:
		// In01 Aud+07
		// In04 Aud+24
		// In01 Aud-18
		const audiolevelMatch = response.match(/^In(\d+) Aud([+-]\d+)$/);
		if (audiolevelMatch) {
			let input = parseInt(audiolevelMatch[1]);	// Input number
			let level = audiolevelMatch[2];				// Audio level
			
			this.audioLevel[input] = level; // save level
			this.setVariableValues({[`AudioLevelIn${input}`]: level})
			
			this.log('debug', 'Audio Levels: ' + JSON.stringify(this.audioLevel));
			this.checkFeedbacks('audio_level');
		}
		
		// **Frontpanel Lock**:
		// Exe1 (locked)
		// Exe0
		const lockMatch = response.match(/^Exe(\d)$/);
		if (lockMatch) {
			switch(lockMatch[1]) {
				case '1': this.lock = 'locked'; break;
				case '0': this.lock = 'unlocked'; break;
			}
			this.setVariableValues({'FrontPanelLock': this.lock})
			this.log('debug', 'Frontpanel Lock: ' + this.lock);
			this.checkFeedbacks('lock_status');
		}
		
		//------------------------------------ Init parsing
		// **Audio Level on connect**:
		// +03
		// +24
		// -18
		const audiolevelinitMatch = response.match(/^([+-]\d{2})$/);
		if (audiolevelinitMatch) {
			let input = this.audioIn;	// Input number
			let level = audiolevelinitMatch[1];		// Audio level
			
			this.audioLevel[input] = level; // save level
			this.setVariableValues({[`AudioLevelIn${input}`]: level})
			
			//this.log('debug', 'Audio Levels: ' + JSON.stringify(this.audioLevel));
			
			this.audioIn++
		}
		
		// **AV routes and mutes on connect**:
		// V1*04 A1*02 V2*04 A2*03 Vmt1*0 Amt1*0 Vmt2*0 Amt2*0
		// ([VA])mt(\d{1,2})(?:\*(\d))?
		const avroutesmutesMatch = response.match(/^V1\*(\d{2}) A1\*(\d{2}) V2\*(\d{2}) A2\*(\d{2}) (Vmt1\*\d) (Amt1\*\d) (Vmt2\*\d) (Amt2\*\d)$/);
		if (avroutesmutesMatch) {
			this.parseResponse('Out01 In' + avroutesmutesMatch[1] + ' Vid') // V1*##
			this.parseResponse('Out01 In' + avroutesmutesMatch[2] + ' Aud') // A1*##
			this.parseResponse('Out02 In' + avroutesmutesMatch[3] + ' Vid') // V2*##
			this.parseResponse('Out02 In' + avroutesmutesMatch[4] + ' Aud') // A2*##
			this.parseResponse(avroutesmutesMatch[5])	//Vmt1
			this.parseResponse(avroutesmutesMatch[6])	//Amt1
			this.parseResponse(avroutesmutesMatch[7])	//Vmt2
			this.parseResponse(avroutesmutesMatch[8])	//Amt2
		}
		
		// **Frontpanel Lock on connect**:
		const frontpanelMatch = response.match(/^(\d)$/);
		if (frontpanelMatch) {
			this.parseResponse('Exe' + frontpanelMatch[0])	// 0 or 1
		}
	}
}

runEntrypoint(ExtronMMXInstance, [])

function transformMatrix(matrix) {
	const rows = matrix.length;
	const cols = matrix[0].length;
	
	// calculate sums of columns, rows and total sum
	const colSums = Array(cols).fill(0);
	const rowSums = Array(rows).fill(0);
	let totalSum = 0;
	
	// sum rows and cols beginning with index 1
	for (let i = 1; i < rows; i++) {
	for (let j = 1; j < cols; j++) {
		colSums[j] += matrix[i][j];  // column sums
		rowSums[i] += matrix[i][j];  // row sums
		totalSum += matrix[i][j];    // total sum
	}
	}
	
	// create result matrix
	const result = [];
	
	// add row 0 (total sum and colum sums)
	result.push([totalSum, ...colSums.slice(1)]);
	
	// add other rows with original values and row sums
	for (let i = 1; i < rows; i++) {
	result.push([rowSums[i], ...matrix[i].slice(1)]);
	}
	
	return result;
}