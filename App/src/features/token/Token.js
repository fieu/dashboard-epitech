/**
 * Created by jules on 12/02/17.
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Animated,
    Easing,
    LayoutAnimation,
    UIManager,
    Dimensions,
    TextInput,
    Platform
} from 'react-native';
import _ from 'lodash';
import LoadingIndicator from 'react-native-spinkit';
import { observer } from 'mobx-react/native';
import IconIO from 'react-native-vector-icons/Ionicons';

import Layout from '../../shared/components/Layout';

const CustomLayoutSpring = {
    duration: 1000,
    create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
    },
};

@observer
class Token extends Component {

    constructor(props) {
        super(props);

        UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);

        this.state = {
            removeAnimation: new Animated.Value(0),
        };
    }

    componentWillMount() {
        this.state.removeAnimation.setValue(0);
    }

    async validateToken() {
        const { id, tokensStore: tokens } = this.props;

        tokens.setState({ state: 'validating', id });

        const isValidated = await tokens.validateToken(id);

        if (isValidated) {
            this.animateDeletion();
        } else {
            this.animateWrongToken();
        }
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.remove) {
            await this.validateToken();
        } else {
            this.state.removeAnimation.setValue(0);
        }
    }

    animateWrongToken() {
        const { id, tokensStore: tokens } = this.props;
        this.state.removeAnimation.setValue(0);

        tokens.setState({ state: 'error', id });
        Animated.timing(
            this.state.removeAnimation,
            {
                toValue: 6,
                easing: Easing.bounce,
                duration: 600,
            }
        ).start(() => {
            tokens.setState({ state: 'default', id });
            tokens.refreshAfterAnimation(false);
        });
    }

    animateDeletion() {
        const { id, tokensStore: tokens } = this.props;
        this.state.removeAnimation.setValue(0);

        Animated.timing(
            this.state.removeAnimation,
            {
                toValue: 1,
                easing: Easing.back(2),
                duration: 500,
            }
        ).start(() => {
            tokens.setState({ state: 'default', id });
            tokens.refreshAfterAnimation(true);
        });
    }

    render() {
        const {
            token,
            id,
            value,
            tokensStore: tokens,
            uiStore,
        } = this.props;
        const { width } = Dimensions.get('window');

        let tokenTranslate = tokens.error[id] || false
            ? this.state.removeAnimation.interpolate({
                inputRange: [0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6],
                outputRange: [0, -15, 0, 15, 0, -15, 0, 15, 0, -15, 0, 15, 0]
            })
            : this.state.removeAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width]
            });

        return (
            <Animated.View
                key={id}
                style={{
                    backgroundColor: '#233445',
                    margin: 10,
                    marginTop: 15,
                    elevation: 4,
                    height: 70,
                    transform: [{ translateX: tokenTranslate }]
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 0.5,
                }}>
                    {
                        tokens.value[id]
                            ? (
                                <View
                                    style={{ flex: 0.10, alignSelf: 'center', marginLeft: 10 }}
                                >
                                    <LoadingIndicator
                                        size={16}
                                        color="#FFFFFF"
                                        type="Circle"
                                    />
                                </View>
                            )
                            : (
                                <IconIO
                                    name="ios-notifications-outline"
                                    size={18}
                                    style={{ flex: 0.10, alignSelf: 'center', color: '#FFF', marginLeft: 10 }}
                                />
                            )
                    }
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 4}}>
                        <Text style={{ flex: 0.75, color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>
                            {_.truncate(token.title,{ length: 35, separator: '...'})}
                        </Text>
                        <Text style={{ flex: 0.25, color: '#FFF', fontSize: 12, fontWeight: '100' }}>
                            {token.date}
                        </Text>
                    </View>
                </View>
                <View>
                    <TextInput
                        style={{
                            height: 45,
                            color: '#FFF',
                            fontSize: 11,
                            textAlign: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)'
                        }}
                        keyboardType={Platform.OS === 'ios' ? 'default' : 'number-pad'}
                        maxLength={8}
                        returnKeyType="send"
                        spellCheck={false}
                        autoCorrect={false}
                        multiline={false}
                        placeholder="Type your token"
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        onSubmitEditing={() => uiStore.isConnected && tokens.selectToken(id)}
                        underlineColorAndroid="transparent"
                        blurOnSubmit
                        onChangeText={(text) => tokens.updateValues(text, id)}
                        value={value || ''}
                        editable={!tokens.value[id] || false}
                    />
                </View>
            </Animated.View>
        );
    }
}

Token.propTypes = {
    token: React.PropTypes.object,
    id: React.PropTypes.number,
    onRemove: React.PropTypes.func,
    value: React.PropTypes.string,
    remove: React.PropTypes.bool,
    onAnimationEnd: React.PropTypes.func,
    tokensStore: React.PropTypes.object,
    uiStore: React.PropTypes.object,
};

@observer
export default class Tokens extends Component {

    constructor(props) {
        super(props);
    }

    componentWillUpdate() {
        LayoutAnimation.configureNext(CustomLayoutSpring);
    }

    render() {
        const { store: { ui, tokens } } = this.props;

        return (
          <Layout store={this.props.store}>
              <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#2c3e50' }}>
                      { tokens.tokens.length > 0 ?
                          tokens.tokens.slice().map((token, i) => (
                              <Token
                                  key={i}
                                  token={token}
                                  id={i}
                                  value={tokens.tokenValues[i]}
                                  remove={tokens.selectedToken === i}
                                  tokensStore={tokens}
                                  uiStore={ui}
                              />
                          ))
                          :
                          <View style={{ flex: 1, flexDirection: 'column', marginBottom: 60, justifyContent: 'center' }}>
                              <IconIO
                                  name="ios-notifications-off-outline"
                                  size={100}
                                  style={{ color: '#203040',   alignSelf: 'center' }}
                              />
                              <Text style={{ marginTop: 10, color:'#203040', alignSelf: 'center', fontSize: 15 }}>
                                  No token to validate
                              </Text>
                          </View>
                      }
               </KeyboardAvoidingView>
           </Layout>
        )
    }
};