import React, {ReactNode} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import Colors from '../constants/Colors';

export default function Button(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, props.style]}>
      {props.children !== undefined && typeof props.children === 'string' ? (
        <Text style={[styles.btnText, props.textStyle]}>{props.children}</Text>
      ) : (
        props.children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 17,
    backgroundColor: Colors.blue,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {fontWeight: '600', color: '#fff', fontSize: 18},
});
