import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button, StyleSheet, Text, View, Image } from 'react-native';

const startTop = 300;
const tileSize = 65;
const screenWidth = 180;
var boxCount = [3,4,5,4,3];
var locked = false;

var gameGrid = [];

const cleanGrid = [
	[-1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1,  0,  0,  0, -1],
	[-1, -1,  0,  0,  0,  0, -1],
	[-1,  0,  0,  0,  0,  0, -1],
	[-1,  0,  0,  0,  0, -1, -1],
	[-1,  0,  0,  0, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1]
];

const gameOver = [
	[-1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1,  ' ',  ' ',  ' ', -1],
	[-1, -1,  'G',  'A',  'M',  'E', -1],
	[-1,  ' ',  ' ',  ' ',  ' ',  ' ', -1],
	[-1,  'O',  'V',  'E',  'R', -1, -1],
	[-1,  ' ',  ' ',  ' ', -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1]
];

const winGrid = [
	[-1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1,  ' ',  ' ',  ' ', -1],
	[-1, -1,  'Y',  'O',  'U',  ' ', -1],
	[-1,  ' ',  ' ',  ' ',  ' ',  ' ', -1],
	[-1,  'W',  'I',  'N',  ' ', -1, -1],
	[-1,  ' ',  ' ',  ' ', -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1]
];

var check_status = (j, i, y0, x0) => {
	if (gameGrid[j][i] == -1) {return true;}
	if (gameGrid[j+y0][i+x0] == -1) {return true;}
	if (gameGrid[j][i] == 0) {return false;}
	if (gameGrid[j+y0][i+x0] == 0) {return false;}
	if (gameGrid[j+y0][i+x0] != gameGrid[j][i]) {return true;}
	return false
}

var shift = (dir, iteration = 0) => {
	if (locked) {return;}
	if (iteration > 4) {return;}
	var size = [gameGrid.length - 1, gameGrid[0].length - 1];
	var x = [0, 0];
	var y = [0, 0];
	switch(dir) {
		case 1:
			x = [-1, -1];
			y = [1, 1];
			break;
		case 3:
			x = [-1, -1];
			y = [0, 11];
			break;
		case 5:
			x = [0, -1];
			y = [-1, -1];
			break;
		case 7:
			x = [1, 1];
			y = [-1, -1];
			break;
		case 9:
			x = [1, 1];
			y = [0, 1];
			break;
		case 11:
			x = [0, 1];
			y = [1, 1];
			break;
	}

	if (x[1] > 0) {
		for (var i = 0; i < size[0]; i++) {
			if (y[1] > 0) {
				for (var j = 0; j < size[1]; j++) {
					if (check_status(j, i, y[0], x[0])) {continue;}
					gameGrid[j][i] += gameGrid[j + y[0]][i + x[0]];
					gameGrid[j + y[0]][i + x[0]] = 0;
				}				
			} else {
				for (var j = size[1]; j > 0; j--) {
					if (check_status(j, i, y[0], x[0])) {continue;}
					gameGrid[j][i] += gameGrid[j + y[0]][i + x[0]];
					gameGrid[j + y[0]][i + x[0]] = 0;
				}								
			}
		}
	} else {
		for (var i = size[0]; i > 0; i--) {
			if (y[1] > 0) {
				for (var j = 0; j < size[1]; j++) {
					if (check_status(j, i, y[0], x[0])) {continue;}
					gameGrid[j][i] += gameGrid[j + y[0]][i + x[0]];
					gameGrid[j + y[0]][i + x[0]] = 0;
				}				
			} else {
				for (var j = size[1]; j > 0; j--) {
					if (check_status(j, i, y[0], x[0])) {continue;}
					gameGrid[j][i] += gameGrid[j + y[0]][i + x[0]];
					gameGrid[j + y[0]][i + x[0]] = 0;
				}								
			}
		}
	}

	iteration += 1;
	shift(dir, iteration);
};

var setGrid = (grid) => {
	var temp = grid.map((arr) => {
	    return arr.slice();
	});
	gameGrid = temp;
}

var winGame = () => {
	setGrid(winGrid);
	locked = true;	
}

var loseGame = () => {
	setGrid(gameOver);
	locked = true;	
}

var generate_random = (iteration = 2) => {
	if (locked) {return;}
	if (iteration == 0) {return;}
	var counter = 0;
	for (var i = 0; i < gameGrid.length; i++) {
		for (var j = 0; j < gameGrid[0].length; j++) {
			if (gameGrid[j][i] == 0 ) {counter++;}
			if (gameGrid[j][i] == 2048 ) {
				winGame();
				return;
			}
		}
	}
	if (counter < iteration) {
		loseGame();
		return;
	}
	var tile = Math.floor(Math.random() * counter);
	counter = 0;
	for (var i = 0; i < gameGrid.length; i++) {
		for (var j = 0; j < gameGrid[0].length; j++) {
			if (gameGrid[j][i] == 0 ) {
				counter++;
				if (counter == tile) {
					gameGrid[j][i] = 2;
					break;
				}
			}
		}
	}
	iteration -= 1;
	generate_random(iteration);
}

var unlock = () => {
	locked = false;
	setGrid(cleanGrid);
	generate_random();
}

export default class FinalProject extends Component {

	constructor(props) {
		super(props);
		this.state = {
			color: {
				13: '#F2DFC4',
				14: '#F2DFC4',
				15: '#F2DFC4',
				22: '#F2DFC4',
				23: '#F2DFC4',
				24: '#F2DFC4',
				25: '#F2DFC4',
				31: '#F2DFC4',
				32: '#F2DFC4',
				33: '#F2DFC4',
				34: '#F2DFC4',
				35: '#F2DFC4',
				41: '#F2DFC4',
				42: '#F2DFC4',
				43: '#F2DFC4',
				44: '#F2DFC4',
				51: '#F2DFC4',
				52: '#F2DFC4',
				53: '#F2DFC4',
			},
			text: {
				13: 'white',
				14: 'white',
				15: 'white',
				22: 'white',
				23: 'white',
				24: 'white',
				25: 'white',
				31: 'white',
				32: 'white',
				33: 'white',
				34: 'white',
				35: 'white',
				41: 'white',
				42: 'white',
				43: 'white',
				44: 'white',
				51: 'white',
				52: 'white',
				53: 'white'
			}
		}
	}

	componentDidMount () {
		this.reset();
	}

	reset() {
		unlock();
		this.updateState();
	}

	updateState() {
		this.setState({
			G13: gameGrid[1][3],
			G14: gameGrid[1][4],
			G15: gameGrid[1][5],			
			G22: gameGrid[2][2],			
			G23: gameGrid[2][3],			
			G24: gameGrid[2][4],			
			G25: gameGrid[2][5],			
			G31: gameGrid[3][1],
			G32: gameGrid[3][2],
			G33: gameGrid[3][3],			
			G34: gameGrid[3][4],			
			G35: gameGrid[3][5],			
			G41: gameGrid[4][1],
			G42: gameGrid[4][2],
			G43: gameGrid[4][3],			
			G44: gameGrid[4][4],			
			G51: gameGrid[5][1],
			G52: gameGrid[5][2],
			G53: gameGrid[5][3],			
		});	

		var i, j, d;
		var obj = {};
		var textObj = {};
		for (i = 1; i < 6; i++) {
			for(j = 1; j < 6; j++) {
				d = i*10+j;
				if(gameGrid[i][j] == '2') {
					obj[d] = '#CF834C';
					textObj[d] = 'white';
				} else if (gameGrid[i][j] == '0') {
					obj[d] = '#F2DFC4';
					textObj[d] = 'transparent';
				} else if (gameGrid[i][j] == '4') {
					obj[d] = '#C94222';
					textObj[d] = 'white';
				} else if (gameGrid[i][j] == '8') {
					obj[d] = '#DC202E';
					textObj[d] = 'white';
				} else if (gameGrid[i][j] == '16') {
					obj[d] = '#E00000';
					textObj[d] = 'white';
				} else if (gameGrid[i][j] == '32') {
					obj[d] = '#8A0E26';
					textObj[d] = 'white';
				} else if (gameGrid[i][j] == '64') {
					obj[d] = 'blue';
					textObj[d] = 'white';
				} else if (gameGrid[i][j] == '128') {
					obj[d] = 'green';
					textObj[d] = 'white';
				} 
			}
		}
		this.setState({color: obj});
		this.setState({text: textObj});
	}

	test_scroll(dir) {
		shift(dir);
		generate_random();
		this.updateState();
	}

	render () {
	    return (
	        <View>
				<Button
					onPress={() => this.reset()}
					title="New Game"
					color="rgb(255,93,67)"
					/>
				<Button
					onPress={() => this.test_scroll(1)}
					title="Swipe to Top Right"
					color="rgb(255,93,67)"
					/>
				<Button
					onPress={() => this.test_scroll(3)}
					title="Swipe to Right"
					color="rgb(255,93,67)"
					/>
				<Button
					onPress={() => this.test_scroll(5)}
					title="Swipe to Bottom Right"
					color="rgb(255,93,67)"
					/>
				<Button
					onPress={() => this.test_scroll(7)}
					title="Swipe to Bottom Left"
					color="rgb(255,93,67)"
					/>
				<Button
					onPress={() => this.test_scroll(9)}
					title="Swipe to Left"
					color="rgb(255,93,67)"
					/>
				<Button
					onPress={() => this.test_scroll(11)}
					title="Swipe to Top Left"
					color="rgb(255,93,67)"
					/>
				<View style={[styles.rowBox, {
			    	width: tileSize * boxCount[0],
			    	top: startTop,
			    	left: screenWidth / 2 - tileSize * boxCount[0] / 2,
			    }]}>
					<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[13]}]}><Text style={[styles.tileText, {color: this.state.text[13]}]}>{this.state.G13}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[13]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[13]}]}></View>
			    	</View>
			    					<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[14]}]}><Text style={[styles.tileText, {color: this.state.text[14]}]}>{this.state.G14}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[14]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[14]}]}></View>
			    	</View>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[15]}]}><Text style={[styles.tileText, {color: this.state.text[15]}]}>{this.state.G15}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[15]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[15]}]}></View>
			    	</View>
		        </View>
		        <View style={[styles.rowBox, {
			    	width: tileSize * boxCount[1],
			    	top: startTop + tileSize,
			    	left: (screenWidth - tileSize * boxCount[1]) / 2,
			    }]}>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[22]}]}><Text style={[styles.tileText, {color: this.state.text[22]}]}>{this.state.G22}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[22]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[22]}]}></View>
			    	</View>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[23]}]}><Text style={[styles.tileText, {color: this.state.text[23]}]}>{this.state.G23}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[23]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[23]}]}></View>
			    	</View>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[24]}]}><Text style={[styles.tileText, {color: this.state.text[24]}]}>{this.state.G24}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[24]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[24]}]}></View>
			    	</View>
				    <View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[25]}]}><Text style={[styles.tileText, {color: this.state.text[25]}]}>{this.state.G25}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[25]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[25]}]}></View>
			    	</View>
		        </View>
		        <View style={[styles.rowBox, {
			    	width: tileSize * boxCount[2],
			    	top: startTop + tileSize * 2,
			    	left: (screenWidth - tileSize * boxCount[2]) / 2,
			    }]}>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[31]}]}><Text style={[styles.tileText, {color: this.state.text[31]}]}>{this.state.G31}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[31]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[31]}]}></View>
			    	</View>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[32]}]}><Text style={[styles.tileText, {color: this.state.text[32]}]}>{this.state.G32}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[32]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[32]}]}></View>
			    	</View>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[33]}]}><Text style={[styles.tileText, {color: this.state.text[33]}]}>{this.state.G33}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[33]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[33]}]}></View>
			    	</View>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[34]}]}><Text style={[styles.tileText, {color: this.state.text[34]}]}>{this.state.G34}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[34]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[34]}]}></View>
			    	</View>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[35]}]}><Text style={[styles.tileText, {color: this.state.text[35]}]}>{this.state.G35}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[35]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[35]}]}></View>
			    	</View>
		        </View>
		        <View style={[styles.rowBox, {
			    	width: tileSize * boxCount[3],
			    	top: startTop + tileSize * 3,
			    	left: (screenWidth - tileSize * boxCount[3]) / 2,
			    }]}>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[41]}]}><Text style={[styles.tileText, {color: this.state.text[41]}]}>{this.state.G41}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[41]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[41]}]}></View>
			    	</View>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[42]}]}><Text style={[styles.tileText, {color: this.state.text[42]}]}>{this.state.G42}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[42]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[42]}]}></View>
			    	</View>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[43]}]}><Text style={[styles.tileText, {color: this.state.text[43]}]}>{this.state.G43}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[43]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[43]}]}></View>
			    	</View>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[44]}]}><Text style={[styles.tileText, {color: this.state.text[44]}]}>{this.state.G44}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[44]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[44]}]}></View>
			    	</View>
		        </View>
		        <View style={[styles.rowBox, {
			    	width: tileSize * boxCount[4],
			    	top: startTop + tileSize * 4,
			    	left: (screenWidth - tileSize * boxCount[4]) / 2,
			    }]}>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[51]}]}><Text style={[styles.tileText, {color: this.state.text[51]}]}>{this.state.G51}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[51]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[51]}]}></View>
			    	</View>
			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[52]}]}><Text style={[styles.tileText, {color: this.state.text[52]}]}>{this.state.G52}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[52]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[52]}]}></View>
			    	</View>

			    	<View style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[53]}]}><Text style={[styles.tileText, {color: this.state.text[53]}]}>{this.state.G53}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[53]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[53]}]}></View>
			    	</View>
		        </View>

	        </View>
	    )
	}
}


const styles = StyleSheet.create({
	rowBox: {
		position: 'absolute',
		top: '20px',
		height: tileSize,
		flexDirection: 'row',
	},
	tile: {
		flex: 1,
		borderRadius: 4,
   	 	borderWidth: 0.5,
   	 	borderColor: 'transparent',
    	alignItems: 'center',
    	justifyContent: 'center',
	},
	tileText: {
		fontSize: 20,
		fontWeight: '500',
		color: 'white'
	},
	hexagon: {
		height: 45,
		width: 59,
		alignItems: 'center',
    	justifyContent: 'center',
		backgroundColor: 'rgb(255,93,67)'
	},
	hexagonBottom: {
	    position: 'absolute',
	    bottom: -7,
	    left: 2,
	    width: 0,
	    height: 0,
	    borderStyle: 'solid',
	    borderLeftWidth: 30,
	    borderLeftColor: 'transparent',
	    borderRightWidth: 30,
	    borderRightColor: 'transparent',
	    borderTopWidth: 17,
	    borderTopColor: 'rgb(255,93,67)'
  },
  hexagonTop: {
    position: 'absolute',
    top: -7,
    left: 2,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 30,
    borderLeftColor: 'transparent',
    borderRightWidth: 30,
    borderRightColor: 'transparent',
    borderBottomWidth: 17,
    borderBottomColor: 'rgb(255,93,67)'

  }

})