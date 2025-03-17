export function getActionDefinitions(self) {
	return {
		RouteAV: {
			name: 'Route Audio & Video',
			options: [
				{
					type: 'dropdown',
					id: 'id_output',
					label: 'Output:',
					//tooltip: '',
					default: '1',
					choices: self.OUTPUT
				},
				{
					type: 'dropdown',
					id: 'id_input',
					label: 'Input:',
					default: '1',
					choices: self.INPUT,
				},
			],
			callback: async (action) => {
				
				const cmd = unescape(await self.parseVariablesInString(action.options.id_input + '*' + action.options.id_output + '!'))
				
				if (cmd != '') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + cmd.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(cmd)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
			},
		},
		RouteV: {
			name: 'Route Video',
			options: [
				{
					type: 'dropdown',
					id: 'id_output',
					label: 'Output:',
					//tooltip: '',
					default: '1',
					choices: self.OUTPUT
				},
				{
					type: 'dropdown',
					id: 'id_input',
					label: 'Input:',
					default: '1',
					choices: self.INPUT,
				},
			],
			callback: async (action) => {
				
				const cmd = unescape(await self.parseVariablesInString(action.options.id_input + '*' + action.options.id_output + '%'))
				
				if (cmd != '') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + cmd.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(cmd)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
			},
		},
		RouteA: {
			name: 'Route Audio',
			options: [
				{
					type: 'dropdown',
					id: 'id_output',
					label: 'Output:',
					//tooltip: '',
					default: '1',
					choices: self.OUTPUT
				},
				{
					type: 'dropdown',
					id: 'id_input',
					label: 'Input:',
					default: '1',
					choices: self.INPUT,
				},
			],
			callback: async (action) => {
				
				const cmd = unescape(await self.parseVariablesInString(action.options.id_input + '*' + action.options.id_output + '$'))
				
				if (cmd != '') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + cmd.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(cmd)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
			},
		},
		VideoMute: {
			name: 'Video Un-/Mute',
			options: [
				{
					type: 'dropdown',
					id: 'id_output',
					label: 'Output:',
					//tooltip: '',
					default: '1',
					choices: self.OUTPUT.concat({ id: 'All', label: 'All' })
				},
				{
					type: 'dropdown',
					id: 'id_mute',
					label: 'Mute/Unmute:',
					//tooltip: '',
					default: '1',
					choices: [
						{ id: '1', label: 'Mute' },
						{ id: '0', label: 'Unmute' },
					],
				},
			],
			callback: async (action) => {
				if (action.options.id_output === 'All') {
					var cmd = unescape(await self.parseVariablesInString(action.options.id_mute + '*B'))
				} else {
					var cmd = unescape(await self.parseVariablesInString(action.options.id_output + '*' + action.options.id_mute + 'B'))
				}
				
				if (cmd !== '') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + cmd.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(cmd)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
			},
		},
		AudioMute: {
			name: 'Audio Un-/Mute',
			options: [
				{
					type: 'dropdown',
					id: 'id_output',
					label: 'Output:',
					//tooltip: '',
					default: '1',
					choices: self.OUTPUT.concat({ id: 'All', label: 'All' })
				},
				{
					type: 'dropdown',
					id: 'id_mute',
					label: 'Mute/Unmute:',
					//tooltip: '',
					default: '1',
					choices: [
						{ id: '1', label: 'Mute' },
						{ id: '0', label: 'Unmute' },
					],
				},
			],
			callback: async (action) => {
				if (action.options.id_output === 'All') {
					self.log('debug', 'all')
					var cmd = unescape(await self.parseVariablesInString(action.options.id_mute + '*Z'))
				} else {
					var cmd = unescape(await self.parseVariablesInString(action.options.id_output + '*' + action.options.id_mute + 'Z'))
				}
				
				if (cmd !== '') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + cmd.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(cmd)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
			},
		},
		AudioLevel: {
			name: 'Audio Level',
			options: [
				{
					type: 'dropdown',
					id: 'id_input',
					label: 'Input:',
					default: '1',
					choices: self.INPUT,
				},
				{
					type: 'dropdown',
					id: 'id_level',
					label: 'Level:',
					//tooltip: '',
					default: '0G',
					choices: Array.from({ length: (24 - (-18)) / 1 + 1 }, (_, i) => {
						const value = 24 - i * 1;
						return { id: `${Math.abs(value)}${value >= 0 ? 'G' : 'g'}`, label: `${value >= 0 ? '+' : ''}${value}dB` };
					}),
				},

			],
			callback: async (action) => {
				
				const cmd = unescape(await self.parseVariablesInString(action.options.id_input + '*' + action.options.id_level))
				
				if (cmd != '') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + cmd.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(cmd)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
			},
		},
		AudioLevelIncDec: {
			name: 'Audio Level In-/Decrease',
			options: [
				{
					type: 'dropdown',
					id: 'id_input',
					label: 'Input:',
					default: '1',
					choices: self.INPUT,
				},
				{
					type: 'dropdown',
					id: 'id_dir',
					label: 'Direction:',
					default: '+',
					tooltip: 'in 1dB steps',
					choices: [
						{ id: '+', label: 'Increase +1dB' },
						{ id: '-', label: 'Decrease -1dB' },
					],
				},
			],
			callback: async (action) => {
				
				const cmd = unescape(await self.parseVariablesInString(action.options.id_input + action.options.id_dir + 'G'))
				
				if (cmd != '') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + cmd.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(cmd)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
			},
		},
		Frontpanel: {
			name: 'Frontpanel',
			options: [
				{
					type: 'dropdown',
					id: 'id_lock',
					label: 'Lock/Unlock:',
					default: '1',
					choices: [
						{ id: '1', label: 'Lock' },
						{ id: '0', label: 'Unlock' },
					],
				},
			],

			callback: async (action) => {
				
				const cmd = unescape(await self.parseVariablesInString(action.options.id_lock + 'X'))
				
				if (cmd != '') {
					self.log('debug', 'sending to ' + self.config.host + ': ' + cmd.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(cmd)
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
			},
		},
	}
}
