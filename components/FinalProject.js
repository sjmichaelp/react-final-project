import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button, StyleSheet, Text, View, Image, Modal, TouchableHighlight, Alert, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import GestureRecognizer, {swipeDirections} from '../GestureRecognizer';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';

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

var saveLeaderBoardScore = async () => {
	try {
		let max_num = 0;
		for (let i = 0; i < gameGrid.length; i++){
			for (let a = 0; a < gameGrid[i].length; a++){
				if (gameGrid[i][a] > max_num){
					max_num = gameGrid[i][a];
				}
			}
		}

		var moves_made = await AsyncStorage.getItem('moves_made')
		moves_made_int = parseInt(moves_made) +1;
		let high_score = {moves_made:moves_made_int.toString(), score: max_num};
	
		var leader_board_string = await AsyncStorage.getItem('leader_board')
		if (leader_board_string){
			leader_board_list = JSON.parse(leader_board_string);
			leader_board_list[leader_board_list.length] = high_score;
			await AsyncStorage.setItem('leader_board', JSON.stringify(leader_board_list))
		}
		else {
			await AsyncStorage.setItem('leader_board', JSON.stringify([high_score]))
		}
		
	} catch(e) {
		console.log('error saving or loading leaderboard:', e)
	}

	

}


var winGame = () => {
	saveLeaderBoardScore();
	setGrid(winGrid);
	locked = true;	
}

var loseGame = () => {
	saveLeaderBoardScore();
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
			leader_board: [{}],
			modalVisible: false,
				movesMade: 0,
		    myText: 'I\'m ready to get swiped!',
    		gestureName: 'none',
     		backgroundColor: '#fff',
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

	loadBoardFromStorage = async () => {
		try {
			const value = await AsyncStorage.getItem('current_board')
			const moves_made = await AsyncStorage.getItem('moves_made')
			console.log(value);
			if (value){ 
			setGrid(JSON.parse(value));
			this.updateState();
			this.refs.view1.bounceIn(700)
				this.refs.view2.bounceIn(700);
			this.refs.view3.bounceIn(700);
			this.refs.view4.bounceIn(700);
			this.refs.view5.bounceIn(700).then(endState => {
				this.setState({movesMade: parseInt(moves_made)})
			});
		}
		else {
			this.reset();
		}
		} catch(e) {
			console.log('failed to load board, error:', e);
			this.reset();
		}
	
	}

	getLeaderBoardFromStorage = async () => {
		try {
			const value = await AsyncStorage.getItem('leader_board')
			if (value){

			// generic comparison function
			cmp = function(x, y){
				return x > y ? 1 : x < y ? -1 : 0; 
			};

			//sort name ascending then id descending
			sorted_leader_board = JSON.parse(value).sort(function(a, b){
				return cmp( 
						[-cmp(a.score, b.score), cmp(a.moves_made, b.moves_made)], 
						[-cmp(b.score, a.score), cmp(b.moves_made, a.moves_made)]
				);
			});
			for (let x = 0; x < sorted_leader_board.length; x++){
				sorted_leader_board[x]['rank'] = x+1;
				if (x >= 5){
					sorted_leader_board = sorted_leader_board.slice(0, x);
					break;
				}
			}
			console.log(sorted_leader_board);
			this.setState({leader_board:sorted_leader_board})
		}
		} catch(e) {
			console.log('failed to load board, error:', e);
		}
	
	}

	componentDidMount () {
		this.loadBoardFromStorage();
	}

	reset() {
		unlock();
		this.updateState();
		this.refs.view1.bounceIn(700)
		this.refs.view2.bounceIn(700);
		this.refs.view3.bounceIn(700);
		this.refs.view4.bounceIn(700);
		this.refs.view5.bounceIn(700).then(endState => {
			this.setState({movesMade: 0})
		});
		
		
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
	

	saveBoardLocally = async () => {
		try {
			await AsyncStorage.setItem('moves_made', this.state.movesMade.toString())
			await AsyncStorage.setItem('current_board', JSON.stringify(gameGrid))
		} catch(e) {
			console.log('move not stored.. error:', e)
		}
	
	}

	test_scroll(dir) {
		shift(dir);
		generate_random();
		this.updateState();
		this.setState({movesMade: this.state.movesMade+1})
		this.refs.view1.bounceIn(700);
		this.refs.view2.bounceIn(700);
		this.refs.view3.bounceIn(700);
		this.refs.view4.bounceIn(700);
		this.refs.view5.bounceIn(700).then(endState => {
			this.saveBoardLocally();
		});
	}

	setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }


	render () {
		const config = {
	      velocityThreshold: 0.3,
	      directionalOffsetThreshold: 80
	    };
	    return (
	        <View style={{width:'100%', height:'100%', alignItems:'center', backgroundColor:'rgb(64,64,64)'}}>
	         <GestureRecognizer
		        onSwipeLeft={() => this.test_scroll(9)}
		        onSwipeRight={() => this.test_scroll(3)}
		        onSwipeUpRight={() => this.test_scroll(1)}
		        onSwipeDownRight={() => this.test_scroll(5)}
		        onSwipeUpLeft={() => this.test_scroll(11)}
		        onSwipeDownLeft={() => this.test_scroll(7)}
		        config={config}
		        style={{
		          width: '100%',
		          height: '100%',
		          alignItems:'center',
		        }}
		        >
				<Button
					onPress={() => this.reset()}
					title="New Game"
					color="rgb(255,93,67)"
					/>
					
					<Modal
					style={{backgroundColor:'rgb(64,64,64)'}}
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22, backgroundColor:'rgb(64,64,64)'}}>
            <View style={styles.modalView}>
							<FlatList
							data={this.state.leader_board}
							keyExtractor={(item, index) => index.toString()}
							renderItem={({ item }) => (
								<ListItem
								containerStyle={{ backgroundColor:'rgb(64,64,64)', borderBottomColor: 'red', borderBottomWidth:1, borderRadius:5 }}
 								title={`Rank: ${item.rank}`}
								subtitle={`Score Achieved: ${item.score} 	Moves Made: ${item.moves_made}`}
								titleStyle={{ color: 'white', fontWeight: 'bold' }}
								subtitleStyle={{ color: 'white' }}
								/>
							)}
							/>

              <Button
							color="rgb(255,93,67)"
							title="Hide Leaderboard"
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
              </Button>
            </View>
          </View>
        </Modal>

        <Button
				title="Show Leaderboard"
					color="rgb(255,93,67)"
          onPress={() => {
						this.getLeaderBoardFromStorage();
            this.setModalVisible(true);
          }}>
        </Button>

				<Animatable.View ref="view1" style={[styles.rowBox, {
			    	width: tileSize * boxCount[0],
			    	top: startTop,
			    }]}>
					<Animatable.View animation="bounceIn" ref="view" style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[13]}]}><Text style={[styles.tileText, {color: this.state.text[13]}]}>{this.state.G13}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[13]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[13]}]}></View>
			    	</Animatable.View>
					<Animatable.View animation="bounceIn" delay={100} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[14]}]}><Text style={[styles.tileText, {color: this.state.text[14]}]}>{this.state.G14}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[14]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[14]}]}></View>
			    	</Animatable.View>
					<Animatable.View animation="bounceIn" delay={200} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[15]}]}><Text style={[styles.tileText, {color: this.state.text[15]}]}>{this.state.G15}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[15]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[15]}]}></View>
			    	</Animatable.View>
		        </Animatable.View>
		        <Animatable.View ref="view2" style={[styles.rowBox, {
			    	width: tileSize * boxCount[1],
			    	top: startTop + tileSize,
			    }]}>
					<Animatable.View animation="bounceIn" delay={300} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[22]}]}><Text style={[styles.tileText, {color: this.state.text[22]}]}>{this.state.G22}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[22]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[22]}]}></View>
			    	</Animatable.View>
					<Animatable.View animation="bounceIn" delay={400} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[23]}]}><Text style={[styles.tileText, {color: this.state.text[23]}]}>{this.state.G23}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[23]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[23]}]}></View>
			    	</Animatable.View>
					<Animatable.View animation="bounceIn" delay={500} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[24]}]}><Text style={[styles.tileText, {color: this.state.text[24]}]}>{this.state.G24}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[24]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[24]}]}></View>
			    	</Animatable.View>
				    <Animatable.View animation="bounceIn" delay={600} style={styles.tile}>
			    	<View style={[styles.hexagon, {backgroundColor: this.state.color[25]}]}><Text style={[styles.tileText, {color: this.state.text[25]}]}>{this.state.G25}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[25]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[25]}]}></View>
			    	</Animatable.View>
		        </Animatable.View>
		        <Animatable.View ref="view3" style={[styles.rowBox, {
			    	width: tileSize * boxCount[2],
			    	top: startTop + tileSize * 2,
			    }]}>
					<Animatable.View animation="bounceIn" delay={700} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[31]}]}><Text style={[styles.tileText, {color: this.state.text[31]}]}>{this.state.G31}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[31]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[31]}]}></View>
			    	</Animatable.View>
					<Animatable.View animation="bounceIn" delay={800} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[32]}]}><Text style={[styles.tileText, {color: this.state.text[32]}]}>{this.state.G32}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[32]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[32]}]}></View>
			    	</Animatable.View>
					<Animatable.View animation="bounceIn" delay={900} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[33]}]}><Text style={[styles.tileText, {color: this.state.text[33]}]}>{this.state.G33}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[33]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[33]}]}></View>
			    	</Animatable.View>
					<Animatable.View animation="bounceIn" delay={1000} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[34]}]}><Text style={[styles.tileText, {color: this.state.text[34]}]}>{this.state.G34}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[34]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[34]}]}></View>
			    	</Animatable.View>
					<Animatable.View animation="bounceIn" delay={1100} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[35]}]}><Text style={[styles.tileText, {color: this.state.text[35]}]}>{this.state.G35}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[35]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[35]}]}></View>
			    	</Animatable.View>
		        </Animatable.View>
		        <Animatable.View ref="view4" style={[styles.rowBox, {
			    	width: tileSize * boxCount[3],
			    	top: startTop + tileSize * 3,
			    }]}>
					<Animatable.View animation="bounceIn" delay={1200} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[41]}]}><Text style={[styles.tileText, {color: this.state.text[41]}]}>{this.state.G41}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[41]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[41]}]}></View>
			    	</Animatable.View>
					<Animatable.View animation="bounceIn" delay={1300} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[42]}]}><Text style={[styles.tileText, {color: this.state.text[42]}]}>{this.state.G42}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[42]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[42]}]}></View>
			    	</Animatable.View>
					<Animatable.View animation="bounceIn" delay={1400} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[43]}]}><Text style={[styles.tileText, {color: this.state.text[43]}]}>{this.state.G43}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[43]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[43]}]}></View>
			    	</Animatable.View>
					<Animatable.View animation="bounceIn" delay={1500} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[44]}]}><Text style={[styles.tileText, {color: this.state.text[44]}]}>{this.state.G44}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[44]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[44]}]}></View>
			    	</Animatable.View>
		        </Animatable.View>
		        <Animatable.View ref="view5" style={[styles.rowBox, {
			    	width: tileSize * boxCount[4],
			    	top: startTop + tileSize * 4,
			    }]}>
					<Animatable.View animation="bounceIn" delay={1600} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[51]}]}><Text style={[styles.tileText, {color: this.state.text[51]}]}>{this.state.G51}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[51]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[51]}]}></View>
			    	</Animatable.View>
					<Animatable.View animation="bounceIn" delay={1700} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[52]}]}><Text style={[styles.tileText, {color: this.state.text[52]}]}>{this.state.G52}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[52]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[52]}]}></View>
			    	</Animatable.View>

					<Animatable.View animation="bounceIn" delay={1800} style={styles.tile}><View style={[styles.hexagon, {backgroundColor: this.state.color[53]}]}><Text style={[styles.tileText, {color: this.state.text[53]}]}>{this.state.G53}</Text></View>
			    	<View style={[styles.hexagonTop, {borderBottomColor: this.state.color[53]}]}></View>
			    	<View style={[styles.hexagonBottom, {borderTopColor: this.state.color[53]}]}></View>
			    	</Animatable.View>
		        </Animatable.View>
      			</GestureRecognizer>
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

	},
	modalView: {
		backgroundColor: 'rgb(64,64,64)',
	},
	listItemStyle: {

	},

})