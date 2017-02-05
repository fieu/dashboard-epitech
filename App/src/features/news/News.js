/**
 * Created by jules on 04/02/17.
 */

//noinspection JSUnresolvedVariable
import React, { Component } from 'react';
//noinspection JSUnresolvedVariable
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import {
    Container,
    Content,
    List,
    ListItem,
} from 'native-base';

export default class News extends Component {

    render() {

        let items = ['', '', '', '','', '', '', '','', '', '', '','', '', '', ''];

        return (
            <Container>
                <Content>
                    <List
                        dataArray={items}
                        renderRow={(item) =>
                            <ListItem>
                                <Text>{item}</Text>
                            </ListItem>
                        }>
                    </List>
                </Content>
            </Container>
        );
    }
};