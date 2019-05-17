import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from 'react-native-elements'
import Colors from '../constants/Colors'

export default class ListItem extends Component {
    state = {
        completionPercentage: Math.floor(Math.random() * 100),
        completionColor: 'gray'
    };

    determineCompletionColor() {
        const percentage = this.state.completionPercentage;

        if (percentage > 75) {
            return Colors.statusGreen;
        } else if (percentage > 50) {
            return Colors.statusYellow;
        } else if (percentage > 25) {
            return Colors.statusOrange;
        }

        return Colors.statusRed;
    };

    render() {
        this.state.completionColor =  this.determineCompletionColor();

        return (
            <View style={[styles.listItem, { backgroundColor: Colors.darkBackground }]}>
                <Badge
                    value={`${this.state.completionPercentage}%`}
                    status="primary"
                    badgeStyle={[styles.badge, { borderColor: this.state.completionColor }]}
                    textStyle={[styles.badgeText, { color: this.state.completionColor }]}
                />
                <View style={styles.listItemTextContainer}>
                    <Text style={[styles.text]}>This is a task you need to do</Text>
                    <Text style={[styles.blocker]}>This is a blocker</Text>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    listItem: {
        height: 75,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: Colors.darkSecondary
    },
    text: {
        color: 'white',
        flex: 0.8,
        flexWrap: 'wrap',
        width: '100%',
        height: 70,
        flexGrow: 1,
    },
    badge: {
        flex: 0.2,
        padding: 2,
        borderRadius: 5,
        backgroundColor: Colors.darkBackground,
        width: 40
    },
    badgeText: {
        textAlign: 'center'
    },
    blocker: {
        color: 'red'
    },
    listItemTextContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 15,
        width: '80%',
        flexWrap: 'wrap'
    }
});