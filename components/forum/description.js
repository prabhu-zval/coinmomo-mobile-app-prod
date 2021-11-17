import React, { useState, useContext, useRef } from 'react';
import { StyleSheet, StatusBar, View, Text, Image, Pressable, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import { IMAGE_PATH } from '../../utils/constants';
import { API } from '../../services/apiService';
import { LoginContext } from '../../context/context';

export default function TextEditor(props) {
    const [description, setDescription] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    const focusPoint = useRef();
    const { userDetails, pageLoading, setPageLoading } = useContext(LoginContext)
    let dataObj = {}
    const htmlEditor = (data) => {
        if (data) {
            setDescriptionError(false)
            setDescription(data)
        }
    }
    const onCreateFunction = async () => {
        if (!description) {
            setDescriptionError('Description should not be empty')
            return
        }
        if (description == "") {
            setDescriptionError('Description should not be empty')
            return
        }
        let desc = description.trim();
        dataObj['title'] = props.route.params.title
        dataObj['description'] = desc
        dataObj['user_data'] = userDetails
        props.route.params.category ? dataObj['category'] = props.route.params.category : delete dataObj['category']
        props.route.params.community ? dataObj['community'] = props.route.params.community : delete dataObj['community']
        props.route.params.tags.length > 0 ? dataObj['tags'] = props.route.params.tags : delete dataObj['tags']
        props.route.params.socialLink ? dataObj['social_link'] = props.route.params.socialLink : delete dataObj['social_link']
        let data = {
            data_obj: JSON.stringify(dataObj)
        }
        await API.request('insertThread', undefined, 'POST', null, null, null, null, null, data)
        setPageLoading(!pageLoading)
        props.navigation.navigate('forum')
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.descriptionContainer}>
                <View style={styles.threadIconAndText}>
                    <View style={styles.threadView}><Image style={styles.coimmomoLogo} source={IMAGE_PATH.logo} /></View>
                </View>
                <View style={styles.descriptionView}>
                    <View>
                        <View style={styles.descriptionViewContainer}>
                            <Text style={styles.descriptionText}> Description  <Text style={styles.descriptionErrorIndicatorText}>* required</Text></Text>
                        </View>
                        {descriptionError ? <Text style={styles.descriptionErrorIndicator}>{descriptionError}</Text> : null}
                    </View>
                </View>
                <Pressable onPress={() => focusPoint.current.focus()}>
                    <View style={styles.quillEditorView}>
                        <TextInput
                            ref={focusPoint}
                            multiline={true}
                            placeholder={"Type Here..."}
                            onChangeText={(text) => htmlEditor(text)}
                            style={styles.editTextInputdescription}
                        />
                    </View>
                </Pressable>
                <Pressable style={styles.bottomCreateButton} onPress={() => onCreateFunction()}>
                    <View >
                        <Text style={styles.createText}>create</Text>
                    </View>
                </Pressable>
            </View>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    editTextInputdescription: {
        maxHeight: 290,
        fontWeight: 'bold',
        color: 'black',
        margin: '2%'
    },
    label: {
        color: 'gray',
        fontSize: 15,
        fontWeight: 'normal',
        marginBottom: '1%',
        height: 23
    },
    descriptionViewContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '10%'
    },
    descriptionErrorIndicator: {
        color: 'red',
        paddingLeft: 5
    },
    urlError: {
        display: 'flex',
        flexDirection: 'row'
    },
    descriptionStar: {
        color: 'red',
        fontSize: 25,
        fontWeight: 'bold',
        paddingLeft: 5
    },
    descriptionErrorIndicatorText: {
        color: 'red',
        marginTop: '5%',
        marginLeft: '70%'
    },
    descriptionContainer: {
        backgroundColor: 'white',
        height: '100%',
        marginTop: 20
    },
    descriptionView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingRight: '5%'
    },
    descriptionText: {
        backgroundColor: 'white',
        height: 30,
        fontSize: 18,
        color: 'gray',
        fontWeight: 'bold'
    },
    quillEditorView: {
        width: '90%',
        marginTop: '2%',
        height: 300,
        borderWidth: 1,
        marginLeft: '5%',
        borderColor: '#F75626',
        backgroundColor: 'white'
    },
    quillToolbarView: {
        marginTop: '2%',
        backgroundColor: 'white'
    },
    createText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 5
    },
    title: {
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingVertical: 10,
    },
    root: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#eaeaea',
    },
    threadIconAndText: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '3%',
        height: 65,
        backgroundColor: 'white',
        paddingTop: 25,
        borderBottomWidth: 0.5,
        borderBottomColor: 'black',
    },
    Icon: {
        width: 40,
        paddingLeft: 10
    },
    threadView: {
        zIndex: -1,
        position: 'absolute',
        width: '100%',
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
    },
    coimmomoLogo: {
        width: 150,
        height: 40
    },
    bottomButtons: {
        width: '45%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 25,
        paddingTop: '2%',
        height: 45,
        backgroundColor: '#61db14',
        marginBottom: '3%',
    },
    bottomCreateButton: {
        marginTop: '5%',
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 25,
        height: 45,
        backgroundColor: '#3F51B5',
        marginBottom: '3%'
    },
    bottomCancelButton: {
        width: '45%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 25,
        paddingTop: '2%',
        height: 45,
        backgroundColor: 'lightgray',
        marginBottom: '3%'
    },
    categorytextInput: {
        height: 40,
        width: '80%',
        paddingLeft: '5%',
        borderBottomWidth: 1.5,
        borderColor: '#8fc73d',
        backgroundColor: 'white'
    },
    categoryLabelInput: {
        height: 40,
        width: '80%',
        paddingLeft: '5%',
        borderWidth: 1.5,
        borderRightWidth: 0,
        borderColor: '#8fc73d',
        backgroundColor: 'white',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    categoryArrow: {
        width: '10%',
        borderBottomWidth: 1.5,
        borderColor: '#8fc73d',
        height: 40,
        paddingTop: 15,
        paddingLeft: '3%',
        backgroundColor: 'white'
    },
    categoryDeleteInput: {
        width: '10%',
        borderWidth: 1.5,
        borderColor: '#8fc73d',
        borderLeftWidth: 0,
        borderRightWidth: 0,
        height: 40,
        paddingTop: 10,
        paddingLeft: '3%',
        backgroundColor: 'white',
    },
    categoryDelete: {
        width: '10%',
        borderBottomWidth: 1.5,
        borderColor: '#8fc73d',
        height: 40,
        paddingTop: 13,
        paddingLeft: '3%',
        backgroundColor: 'white'
    },
    categoryArrowInput: {
        width: '10%',
        borderWidth: 1.5,
        borderColor: '#8fc73d',
        borderLeftWidth: 0,
        height: 40,
        paddingTop: 15,
        paddingLeft: '3%',
        backgroundColor: 'white',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    titleAndTextInput: {
        width: '100%',
        height: 75,
        marginTop: '3%',
        paddingLeft: '5%',
        paddingRight: '5%'
    },
    textInputs: {
        display: 'flex',
        flexDirection: 'row'
    },
});