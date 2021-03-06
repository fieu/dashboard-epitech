/**
 * Created by jules on 04/02/17.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import {
    Text,
    Image,
    Platform,
    View,
    ListView,
} from 'react-native';
import IconIO from 'react-native-vector-icons/Ionicons';
import Layout from '../../shared/components/Layout';
import styles from './styles.js';

const noPicture = 'https://intra.epitech.eu/staticceeb245e183d75bbe0e66d363037166fc670c425/img/nopicture-profilview.png';

@observer
export default class News extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    render() {
        const { store: { session } } = this.props;

        return (
              <Layout store={this.props.store}>
                <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
                    {
                        session.userData.news.slice().length > 0 ?
                            <ListView
                                dataSource={this.ds.cloneWithRows(session.userData.news.slice())}
                                enableEmptySections={true}
                                renderRow={(news) => {
                                    return (
                                        <View style={{ flex: 1, flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.1)' }}>
                                            <Image
                                                source={{ uri: news.user.picture === null ? noPicture : news.user.picture}}
                                                style={Platform.OS === 'ios' ? styles.pictureIOS : styles.pictureAndroid}
                                            />
                                            <Text style={styles.title}>{news.title}{'\n'}
                                                <Text style={styles.detail}>
                                                { news.details }
                                                </Text>
                                            </Text>
                                        </View>
                                    );
                                }}
                            />
                        :
                            <View style={{ flex: 1, backgroundColor: '#2c3e50', flexDirection: 'column', justifyContent: 'center' }}>
                                <IconIO
                                    name="ios-pulse-outline"
                                    size={100}
                                    style={{ color: '#203040',   alignSelf: 'center' }}
                                />
                                <Text style={{ marginTop: 10, color:'#203040', alignSelf: 'center', fontSize: 15 }}>
                                    No new notifications
                                </Text>
                             </View>
                    }
                </View>
            </Layout>
        );
    }
};