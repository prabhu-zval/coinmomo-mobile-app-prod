import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BeamUpdates() {
    return (
        <View style={style.blogsContainer}>
            <Text>COMING SOON</Text>
        </View>
    );
}
const style = StyleSheet.create({
    blogsContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '50%'
    }
})