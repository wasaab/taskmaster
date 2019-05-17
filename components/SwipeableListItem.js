import React, { Component } from 'react';
import {StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-swipeable';
import ListItem from './ListItem'

export default class SwipeableListItem extends ListItem {
    render() {
        return (
            <Swipeable
                leftButtonWidth={45}
                leftButtons={leftSwipeButtons()}
                rightContent={rightSwipeDeleteAction()}
                onLeftButtonsOpenRelease={this.props.onOpen}
                onLeftButtonsCloseRelease={this.props.onClose}
            >
                <ListItem />
            </Swipeable>
        );
    }
}

function leftSwipeButtons() {
    return [
        <TouchableOpacity style={[styles.leftSwipeItem, { backgroundColor: 'turquoise' }]}>
            <Text>1</Text>
        </TouchableOpacity>,
        <TouchableOpacity style={[styles.leftSwipeItem, { backgroundColor: 'firebrick' }]}>
            <Text>2</Text>
        </TouchableOpacity>,
        <TouchableOpacity style={[styles.leftSwipeItem, { backgroundColor: 'chartreuse' }]}>
            <Text>3</Text>
        </TouchableOpacity>
    ];
}

function rightSwipeDeleteAction() {
    return (
        <View style={[styles.rightSwipeItem, { backgroundColor: 'red' }]}>
            <Text>Delete</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    leftSwipeItem: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 20
    },
    rightSwipeItem: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20
    }
});