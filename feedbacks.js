import { combineRgb } from '@companion-module/base'
//import { OUTPUT, INPUT } from './actions.js'

export function initFeedbacks(self) {
	return {
		mute_status: {
			type: 'boolean',
			name: 'Mute Status',
			description: 'Indicates whether an output is muted',
			defaultStyle: {
				bgcolor: combineRgb(255,0,0),
				color: combineRgb(0,0,0),
			},
			options: [
				{
					type: 'dropdown',
					id: 'id_output',
					label: 'Output:',
					default: '1',
					choices: self.OUTPUT.concat({ id: '0', label: 'All' })
				},
				{
					type: 'dropdown',
					id: 'id_type',
					label: 'Audio/Video:',
					default: '0',
					choices: [
						{ id: '0', label: 'Both' },
						{ id: '1', label: 'Audio' },
						{ id: '2', label: 'Video' },
					],
				},
			],
			callback: (feedback) => {
				const output = feedback.options.id_output;
				const type = feedback.options.id_type;
				//self.log('debug', 'type: ' + type)
				//self.log('debug', 'output: ' + output)
				//self.log('debug', 'mute status: ' + self.muteStates[output][type])
				if (type == 0 && output == 0) {	// Audio and Video of all outputs
					return self.muteStates[output][type] === 4;
				} else if (type == 0 || output == 0) {	// Audio and Video or both Audio or both Video
					return self.muteStates[output][type] === 2;
				} else {
					return self.muteStates[output][type] === 1;
				}
			}
		},
		routing_status: {
			type: 'boolean',
			name: 'Routing Status',
			description: 'Indicates whether an input is routed to an output',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					id: 'id_output',
					label: 'Output:',
					default: '1',
					choices: self.OUTPUT
				},
				{
					type: 'dropdown',
					id: 'id_input',
					label: 'Input:',
					default: '1',
					choices: self.INPUT
				},
				{
					type: 'dropdown',
					id: 'id_type',
					label: 'Audio/Video:',
					default: '0',
					choices: [
						{ id: '0', label: 'Both' },
						{ id: '1', label: 'Audio' },
						{ id: '2', label: 'Video' },
					],
				},
			],
			callback: (feedback) => {
				const output = parseInt(feedback.options.id_output);
				const input = parseInt(feedback.options.id_input);
				const type = parseInt(feedback.options.id_type);
		
				// Check routing based on type
				if (type === 0) { // Both Audio & Video must match
					return (
						self.routingMatrix[output][1] === input && // Audio
						self.routingMatrix[output][2] === input // Video
					);
				} else {
					// Check only the selected type (1 = Audio, 2 = Video)
					return self.routingMatrix[output][type] === input;
				}
			}
		},
		lock_status: {
			type: 'boolean',
			name: 'Frontpanel Lock Status',
			description: 'Indicates whether the Frontpanel ist locked',
			defaultStyle: {
				bgcolor: combineRgb(255,0,0),
				color: combineRgb(0,0,0),
			},
			callback: (feedback) => {
				//self.log('debug', 'fb lock: ' + self.lock)
				if (self.lock == 'locked') {
					return true;
				} else {
					return false;
				}
			}
		},
	};
}
