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
                    containerStyle={styles.badgeContainer}
                    badgeStyle={[styles.badge, { borderColor: this.state.completionColor }]}
                    textStyle={[styles.badgeText, { color: this.state.completionColor }]}
                />
                <View style={styles.listItemTextContainer}>
                    <Text style={[styles.taskTitle]}>Make a create task screen</Text>
                    <Text style={[styles.blocker]}>React is tricky</Text>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    listItem: {
        height: 62,
        paddingTop: 10,
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: Colors.darkSecondary
    },
    taskTitle: {
        color: 'white',
        flex: 0.8,
        flexWrap: 'wrap',
        width: '100%',
        height: 70,
        // flexGrow: 1,
        fontFamily: 'System',
        fontWeight: '700',
        fontSize: 20,
        // paddingTop: 5
    },
    badgeContainer: {
        paddingTop: 2,
        paddingRight: 3
    },
    badge: {
        flex: 0.2,
        borderRadius: 5,
        borderWidth: 1.5,
        backgroundColor: Colors.darkBackground,
        minWidth: 48,
        minHeight: 15
    },
    badgeText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '800'
    },
    blocker: {
        color: 'rgba(255,59,48, 0.8)',
        fontFamily: 'System',
        fontWeight: '600'
    },
    listItemTextContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        flexWrap: 'wrap',
        flex: 0.9
    }
});