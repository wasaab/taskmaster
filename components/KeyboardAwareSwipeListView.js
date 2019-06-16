import React, { Component } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view'

export default class KeyboardAwareSwipeListView extends SwipeListView {
    render() {
      return (
        <KeyboardAwareSectionList
          {...this.props}
          {...this.listViewProps}
          ref={ c => this.setRefs(c) }
          onScroll={ e => this.onScroll(e) }
          renderItem={(rowData) => this.renderItem(rowData, this._rows)}
        />
      );
    }
  }