import { combineRgb } from '@companion-module/base'
export function initPresets(instance) {
	let self = instance;
	let presets = {}
	
	for (let a in self.INPUT) {
		let input = self.INPUT[a]
		for (let b in self.OUTPUT) {
			let output = self.OUTPUT[b]
			
			presets[`AVRoute_In${input.id}_to_Out${output.id}`] = {
				type: 'button',
				category: 'Route AV',
				name: 'Route Input Audio and Video to Output and read current routes for feedback',
				style: {
					text: `AV${input.id}\\n🡇\\nOut${output.id}`,
					textExpression: false,
					size: 'auto',
					alignment: 'center:center',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {
					relativeDelay: false,
					rotaryActions: false,
					stepAutoProgress: true
				},
				steps: [
					{
						down: [
							{
								actionId: 'RouteAV',
								delay: 0,
								options: {
									id_output: output.id,
									id_input: input.id
								},
							},
						],
					},
				],
				feedbacks: [
					{
						feedbackId: 'routing_status',
						options: {
							id_output: output.id,
							id_input: input.id,
							id_type: 0
						},
						style: {bgcolor: combineRgb(0, 255, 0)},
						isInverted: false,
					}
				],
			},
			presets[`ARoute_In${input.id}_to_Out${output.id}`] = {
				type: 'button',
				category: 'Route A',
				name: 'Route Input Audio to Output and read current routes for feedback',
				style: {
					text: `Aud${input.id}\\n🡇\\nOut${output.id}`,
					textExpression: false,
					size: 'auto',
					alignment: 'center:center',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {
					relativeDelay: false,
					rotaryActions: false,
					stepAutoProgress: true
				},
				steps: [
					{
						down: [
							{
								actionId: 'RouteA',
								delay: 0,
								options: {
									id_output: output.id,
									id_input: input.id
								},
							},
						],
					},
				],
				feedbacks: [
					{
						feedbackId: 'routing_status',
						options: {
							id_output: output.id,
							id_input: input.id,
							id_type: 1
						},
						style: {bgcolor: combineRgb(0, 255, 0)},
						isInverted: false,
					}
				],
			},
			presets[`VRoute_In${input.id}_to_Out${output.id}`] = {
				type: 'button',
				category: 'Route V',
				name: 'Route Input Video to Output and read current routes for feedback',
				style: {
					text: `Vid${input.id}\\n🡇\\nOut${output.id}`,
					textExpression: false,
					size: 'auto',
					alignment: 'center:center',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {
					relativeDelay: false,
					rotaryActions: false,
					stepAutoProgress: true
				},
				steps: [
					{
						down: [
							{
								actionId: 'RouteV',
								delay: 0,
								options: {
									id_output: output.id,
									id_input: input.id
								},
							},
						],
					},
				],
				feedbacks: [
					{
						feedbackId: 'routing_status',
						options: {
							id_output: output.id,
							id_input: input.id,
							id_type: 2
						},
						style: {bgcolor: combineRgb(0, 255, 0)},
						isInverted: false,
					}
				],
			}
			
			
		}
	}
	
	presets['mute_audio'] = {
		type: 'button',
		category: 'Mutes',
		name: 'Mute all Audio Output with longpress and read current routes for feedback. Unmute with short press.',
		style: {
			text: 'Audio Mute',
			textExpression: false,
			size: 'auto',
			alignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		options: {
			relativeDelay: false,
			rotaryActions: false,
			stepAutoProgress: true
		},
		steps: [
			{
				up: [
					{
						actionId: 'AudioMute',
						delay: 0,
						options: {
							id_output: 'All',
							id_mute: 0
						},
					},
				],
				250: {
					actions: [
					{
						actionId: 'AudioMute',
						delay: 0,
						options: {
							id_output: 'All',
							id_mute: 1
						},
					},
				],
				options: { runWhileHeld: true }
				}
			},
		],
		feedbacks: [
			{
				feedbackId: 'mute_status',
				options: {
					id_output: 0,
					id_type: 1
				},
				style: {bgcolor: combineRgb(255, 0, 0)},
				isInverted: false,
			}
		],
	},
	presets['mute_video'] = {
		type: 'button',
		category: 'Mutes',
		name: 'Mute all Video Output with longpress and read current routes for feedback. Unmute with short press.',
		style: {
			text: 'Video Mute',
			textExpression: false,
			size: 'auto',
			alignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		options: {
			relativeDelay: false,
			rotaryActions: false,
			stepAutoProgress: true
		},
		steps: [
			{
				up: [
					{
						actionId: 'VideoMute',
						delay: 0,
						options: {
							id_output: 'All',
							id_mute: 0
						},
					},
				],
				250: {
					actions: [
					{
						actionId: 'VideoMute',
						delay: 0,
						options: {
							id_output: 'All',
							id_mute: 1
						},
					},
				],
				options: { runWhileHeld: true }
				}
			},
		],
		feedbacks: [
			{
				feedbackId: 'mute_status',
				options: {
					id_output: 0,
					id_type: 2
				},
				style: {bgcolor: combineRgb(255, 0, 0)},
				isInverted: false,
			}
		],
	},
	presets['mute_all'] = {
		type: 'button',
		category: 'Mutes',
		name: 'Mute Audio & Video on all Outputs with longpress and read current routes for feedback. Unmute with short press.',
		style: {
			text: 'Mute\\nAll',
			textExpression: false,
			size: 'auto',
			alignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		options: {
			relativeDelay: false,
			rotaryActions: false,
			stepAutoProgress: true
		},
		steps: [
			{
				up: [
					{
						actionId: 'VideoMute',
						delay: 0,
						options: {
							id_output: 'All',
							id_mute: 0
						},
					},
					{
						actionId: 'AudioMute',
						delay: 100,
						options: {
							id_output: 'All',
							id_mute: 0,
						},
					}
				],
				250: {
					actions: [
					{
						actionId: 'VideoMute',
						delay: 0,
						options: {
							id_output: 'All',
							id_mute: 1
						},
					},
					{
						actionId: 'AudioMute',
						delay: 100,
						options: {
							id_output: 'All',
							id_mute: 1
						},
					},
				],
				options: { runWhileHeld: true }
				}
			},
		],
		feedbacks: [
			{
				feedbackId: 'mute_status',
				options: {
					id_output: 0,
					id_type: 0
				},
				style: {bgcolor: combineRgb(255, 0, 0)},
				isInverted: false,
			}
		],
	}
	
	for (let b in self.OUTPUT) {
		let output = self.OUTPUT[b]
		presets[`AMute_Out${output.id}`] = {
			type: 'button',
			category: 'Mutes',
			name: 'Mute Audio on single Output with longpress and read current routes for feedback. Unmute with short press.',
			style: {
				text: `Audio Mute ${output.id}`,
				textExpression: false,
				size: 'auto',
				alignment: 'center:center',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			options: {
				relativeDelay: false,
				rotaryActions: false,
				stepAutoProgress: true
			},
			steps: [
				{
					up: [
						{
							actionId: 'AudioMute',
							delay: 0,
							options: {
								id_output: output.id,
								id_mute: 0
							},
						},
					],
					250: {
						actions: [
						{
							actionId: 'AudioMute',
							delay: 0,
							options: {
								id_output: output.id,
								id_mute: 1
							},
						},
					],
					options: { runWhileHeld: true }
					}
				},
			],
			feedbacks: [
				{
					feedbackId: 'mute_status',
					options: {
						id_output: output.id,
						id_type: 1
					},
					style: {bgcolor: combineRgb(255, 0, 0)},
					isInverted: false,
				}
			],
		},
		presets[`VMute_Out${output.id}`] = {
			type: 'button',
			category: 'Mutes',
			name: 'Mute Video on single Output with longpress and read current routes for feedback. Unmute with short press.',
			style: {
				text: `Video Mute ${output.id}`,
				textExpression: false,
				size: 'auto',
				alignment: 'center:center',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			options: {
				relativeDelay: false,
				rotaryActions: false,
				stepAutoProgress: true
			},
			steps: [
				{
					up: [
						{
							actionId: 'VideoMute',
							delay: 0,
							options: {
								id_output: output.id,
								id_mute: 0
							},
						},
					],
					250: {
						actions: [
						{
							actionId: 'VideoMute',
							delay: 0,
							options: {
								id_output: output.id,
								id_mute: 1
							},
						},
					],
					options: { runWhileHeld: true }
					}
				},
			],
			feedbacks: [
				{
					feedbackId: 'mute_status',
					options: {
						id_output: output.id,
						id_type: 2
					},
					style: {bgcolor: combineRgb(255, 0, 0)},
					isInverted: false,
				}
			],
		},
		presets[`AVMute_Out${output.id}`] = {
			type: 'button',
			category: 'Mutes',
			name: 'Mute Audio and Video on single Output with longpress and read current routes for feedback. Unmute with short press.',
			style: {
				text: `Mute Out ${output.id}`,
				textExpression: false,
				size: 'auto',
				alignment: 'center:center',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			options: {
				relativeDelay: false,
				rotaryActions: false,
				stepAutoProgress: true
			},
			steps: [
				{
					up: [
						{
							actionId: 'VideoMute',
							delay: 0,
							options: {
								id_output: output.id,
								id_mute: 0
							},
						},
						{
							actionId: 'AudioMute',
							delay: 100,
							options: {
								id_output: output.id,
								id_mute: 0,
							},
						}
					],
					250: {
						actions: [
						{
							actionId: 'VideoMute',
							delay: 0,
							options: {
								id_output: output.id,
								id_mute: 1
							},
						},
						{
							actionId: 'AudioMute',
							delay: 100,
							options: {
								id_output: output.id,
								id_mute: 1
							},
						}
					],
					options: { runWhileHeld: true }
					}
				},
			],
			feedbacks: [
				{
					feedbackId: 'mute_status',
					options: {
						id_output: output.id,
						id_type: 0
					},
					style: {bgcolor: combineRgb(255, 0, 0)},
					isInverted: false,
				}
			],
		}
	}
	
	presets['frontpanel_lock'] = {
		type: 'button',
		category: 'Misc',
		name: 'Lock Frontpanel with longpress and read current state for feedback. Unlock with short press.',
		style: {
			text: 'Frontpanel\\n$(extron-mmx:FrontPanelLock)',
			textExpression: false,
			size: 'auto',
			alignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		options: {
			relativeDelay: false,
			rotaryActions: false,
			stepAutoProgress: true
		},
		steps: [
			{
				up: [
					{
						actionId: 'Frontpanel',
						delay: 0,
						options: {
							id_lock: 0,
						},
					},
				],
				250: {
					actions: [
					{
						actionId: 'Frontpanel',
						delay: 0,
						options: {
							id_lock: 1,
						},
					},
				],
				options: { runWhileHeld: true }
				}
			},
		],
		feedbacks: [
			{
				feedbackId: 'lock_status',
				options: {},
				style: {bgcolor: combineRgb(255, 0, 0)},
				isInverted: false,
			}
		],
	}
	
	for (let a in self.INPUT) {
		let input = self.INPUT[a]
		presets[`Audio_${input.id}_Set_Level`] = {
			type: 'button',
			category: 'Audio Level',
			name: 'Set Audio level and read current setting for feedback.',
			style: {
				text: `Aud ${input.id} Set Level\\n0`,
				textExpression: false,
				size: 'auto',
				alignment: 'center:center',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			options: {
				relativeDelay: false,
				rotaryActions: false,
				stepAutoProgress: true
			},
			steps: [
				{
					down: [
						{
							actionId: 'AudioLevel',
							delay: 0,
							options: {
								id_input: input.id,
								id_level: '0G'
							},
						}
					]
				},
			],
			feedbacks: [],
		},
		presets[`Audio_Level_${input.id}`] = {
			type: 'button',
			category: 'Audio Level',
			name: 'In-/Decrement Audio input with rotary buttons and read current state for feedback. Can be used to display the current gain. Use Feedback "internal: Variable: Check value" for feedback depending on current gain.',
			style: {
				text: `Aud ${input.id}\\n$(extron-mmx:AudioLevelIn1)`,
				textExpression: false,
				size: 'auto',
				alignment: 'center:center',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			options: {
				relativeDelay: false,
				rotaryActions: true,
				stepAutoProgress: true
			},
			steps: [
				{
					rotate_left: [
						{
							actionId: 'AudioLevelIncDec',
							delay: 0,
							options: {
								id_input: input.id,
								id_dir: '-'
							},
						},
					],
					rotate_right: [
						{
							actionId: 'AudioLevelIncDec',
							delay: 0,
							options: {
								id_input: input.id,
								id_dir: '+'
							},
						},
					],
				},
			],
			feedbacks: [],
		}
	}
	
	return presets
}
