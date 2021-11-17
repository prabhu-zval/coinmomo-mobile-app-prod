import React, { useState, useEffect, useContext, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    LogBox,
    ScrollView,
    ActivityIndicator,
    Modal,
} from "react-native";
import { IMAGE_PATH } from "../../utils/constants";
import {
    AntDesign,
    MaterialIcons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import { LoginContext } from "../../context/context";
import { API } from "../../services/apiService";
import moment from "moment";
import { Pressable } from "react-native";

export default function ForumConversation(props) {
    const [conversationData, setConversationData] = useState(null);
    const [conversationReplyData, setConversationReplyData] = useState([])
    const [title, setTitle] = useState(null);
    const [replyDescription, setReplyDescription] = useState(null);
    const [editOption, setEditOption] = useState(false);
    const [description, setDescription] = useState(null);
    const [mainThreadId, setMainThreadId] = useState(null);
    const [reply, setReply] = useState(true);
    const [deleteReply, setDeleteReply] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [conversationLoading, setConversationLoading] = useState(false);
    const [forumPageLoading, setForumPageLoading] = useState(false)
    const [popupBackground, setPopupBackground] = useState(false);
    const [userLikes, setUserLikes] = useState([])
    const [userReplyLikes, setUserReplyLikes] = useState([])
    const [items, setItems] = useState([]);
    const replyCache = useRef();
    const subreplyCache = useRef();
    const editFocus = useRef();
    const subEditFocus = useRef();

    const { userSigninId, pageLoading, setPageLoading, userDetails } = useContext(LoginContext);
    useEffect(() => {
        (async () => {
            setConversationLoading(true);
            if (props.route.params.conversationDetails.replies_arr.length > 0) {
                let params = {
                    replies_arr: props.route.params.conversationDetails.replies_arr
                }
                let replydata = await API.request("conversationReplies", undefined, 'POST', null, null, null, null, null, params)
                setConversationReplyData(replydata)
            }
            setConversationData(props.route.params.conversationDetails);
            setConversationLoading(false);
        })()
        LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop']);
    }, [forumPageLoading]);

    useEffect(() => {
        if (conversationData) {
            setTitle(conversationData.title);
            setDescription(conversationData.description)
            setMainThreadId(conversationData._id);
            setUserLikes(conversationData.likes)
        }
    }, [conversationData, forumPageLoading, conversationReplyData]);
    const onSaveThread = async (id) => {
        if (!title) {
            setTitle(conversationData.title);
            setConversationLoading(false);
            return
        }
        if (!description) {
            setDescription(conversationData.description)
            setConversationLoading(false);
            return
        }
        setConversationLoading(true);
        let desc = description.trim()
        let params = {};
        params["_id"] = id;
        title ? params["title"] = title : delete params["title"];
        desc ? params["description"] = desc : delete params["description"];
        let updatedData = await API.request("conversationUpdate", undefined, "POST", null, null, null, null, null, params);
        setConversationData(updatedData.value);
        setPageLoading(!pageLoading);
        setConversationLoading(false);
    };
    const onReply = async (_id) => {
        setConversationLoading(true);
        let replyDesc = replyDescription.trim()
        let params = {};
        params["thread_id"] = _id;
        params["reply_id"] = _id;
        params["user_data"] = userDetails;
        replyDesc ? params["description"] = replyDesc : delete params["description"];
        if (replyDesc) {
            let ReplyData = await API.request("insertReplies", undefined, "POST", null, null, null, null, null, params);
            setConversationData(ReplyData.value);
            if (ReplyData.value.replies_arr) {
                let replyParams = {
                    replies_arr: ReplyData.value.replies_arr
                }
                let replydata = await API.request("conversationReplies", undefined, 'POST', null, null, null, null, null, replyParams)
                setConversationReplyData(replydata)
            }
        }
        setConversationLoading(false);
        replyCache.current.clear();
        setPageLoading(!pageLoading);
    };
    const threadLikes = async (threadID) => {
        if (!userSigninId) return
        if (!userLikes.includes(userSigninId)) {
            setUserLikes([...userLikes, userSigninId])
        }
        let params = {
            thread_id: threadID,
            user_id: userSigninId
        }
        let threadLike = await API.request("threadLike", undefined, 'POST', null, null, null, null, null, params)
        setConversationData(threadLike.value)
        setPageLoading(!pageLoading)
    }
    function Item(props) {
        const { replies, reply_id } = props
        const [threadDescription, setThreadDescription] = useState(null);
        let reply = []
        reply = conversationReplyData && conversationReplyData.length > 0 && conversationReplyData.filter((val) => val._id == reply_id)
        const users_data = reply.length > 0 && reply[0].user_data;
        const html = reply.length > 0 && reply[0].description;
        const [threadEdit, setThreadEdit] = useState(null);
        const [threadReply, setThreadReply] = useState(true);
        const [subThreadReplyDescription, setSubThreadReplyDescription] = useState(null);
        useEffect(() => {
            setThreadDescription(html)
            setUserReplyLikes(conversationReplyData)
        }, [userReplyLikes])
        let replyLikes = userReplyLikes.length > 0 && userReplyLikes.filter((val) => val._id == reply_id)
        let date2 = new Date();
        var date1 = new Date(reply.length > 0 && reply[0].current_date_time);
        var delta = Math.abs(date1 - date2) / 1000;
        // calculate (and subtract) whole days
        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        // calculate (and subtract) whole hours
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        // calculate whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        const onSubThreadSave = async (_id) => {
            if (!threadDescription) {
                setThreadDescription(html)
                setConversationLoading(false);
                return
            }
            if (threadDescription) {
                setConversationLoading(true);
                let threadDesc = threadDescription.trim()
                let params = {};
                params["reply_id"] = _id;
                threadDesc ? params["description"] = threadDesc : delete params["description"];
                let updatedData = await API.request("conversationRepliesUpdate", undefined, "POST", null, null, null, null, null, params);
                if (updatedData.lastErrorObject.updatedExisting) {
                    let index = conversationReplyData.findIndex((val) => val._id == updatedData.value._id)
                    let filterData = conversationReplyData.splice(index, 1, updatedData.value)
                    setConversationReplyData(conversationReplyData)
                }
            }
            setPageLoading(!pageLoading);
            setConversationLoading(false);
        };

        const onSubThreadReply = async (_id) => {
            let subThreadReplyDesc = subThreadReplyDescription.trim()
            let params = {};
            subThreadReplyDesc ? params["description"] = subThreadReplyDesc : delete params["description"];
            params["reply_id"] = _id;
            params["thread_id"] = mainThreadId,
                params["user_data"] = userDetails;
            setConversationLoading(true);
            if (subThreadReplyDesc) {
                let ReplyData = await API.request("insertReplies", undefined, "POST", null, null, null, null, null, params);
                setConversationData(ReplyData.value);
                let replyParams = {
                    replies_arr: ReplyData.value.replies_arr
                }
                let replydata = await API.request("conversationReplies", undefined, 'POST', null, null, null, null, null, replyParams)
                setConversationReplyData(replydata)
            }
            setPageLoading(!pageLoading);
            subreplyCache.current.clear();
            setConversationLoading(false);
        };
        const deleteReplies = async (id) => {
            setIsModalVisible(false);
            setConversationLoading(true);
            let params = {
                thread_id: mainThreadId,
                reply_id: deleteReply && deleteReply,
            };
            let deleteReplys = await API.request("deleteForumReplies", undefined, "POST", null, null, null, null, null, params);
            setConversationData(deleteReplys.value);
            setConversationLoading(false);
            setPageLoading(!pageLoading);
            setPopupBackground(false);
        };
        const replyLike = (replyID) => {
            if (!userSigninId) return
            let replyIndex = userReplyLikes.findIndex((val) => val._id == replyID)
            let userLikesThread1 = userReplyLikes.length > 0 && userReplyLikes.filter((val) => val._id == replyID)
            let userLikesThread = userLikesThread1.length > 0 && userLikesThread1.map((val) => {
                if (val.likes.indexOf(userSigninId) == -1) {
                    return {
                        ...val,
                        likes: [...val.likes, userSigninId]
                    }
                }
            })
            if (userLikesThread) {
                let selectData = Object.assign({}, userLikesThread)
                let filterDataLikes = userReplyLikes.splice(replyIndex, 1, selectData["0"])
                setUserReplyLikes([])
            }
            setConversationReplyData(conversationReplyData)
        }
        const replyLikeAPi = async (replyID) => {
            let params = {
                reply_id: replyID,
                user_id: userSigninId
            }
            let repliesLike = await API.request("repliesLike", undefined, "POST", null, null, null, null, null, params);
            let index = conversationReplyData.findIndex((val) => val._id == repliesLike.value._id)
            let filterData = conversationReplyData.splice(index, 1, repliesLike.value)
            setConversationReplyData(conversationReplyData)
        }
        return (
            <View>
                <View style={style.threadConversation}>
                    <View style={style.conversationHeader}>
                        <View style={style.userNameDetails}>
                            <View style={style.userView}>
                                {!users_data.image ? (
                                    <Text style={style.user}>
                                        {users_data.name ? users_data.name.charAt(0).toUpperCase() : null}
                                    </Text>
                                ) : (
                                    <Image
                                        style={style.userImage}
                                        source={{ uri: users_data.image }}
                                    />
                                )}
                            </View>
                            <View>
                                <Text style={style.userName}>
                                    {users_data.name ? users_data.name[0].toUpperCase() + users_data.name.slice(1) : null}
                                </Text>
                                {days > 0 ? (
                                    <Text style={style.time}>{days} day(s) ago</Text>
                                ) : hours > 0 ? (
                                    <Text style={style.time}>{hours} hour(s) ago</Text>
                                ) : (
                                    <Text style={style.time}>{minutes} minute(s) ago</Text>
                                )}
                            </View>
                        </View>
                    </View>
                    <View style={style.subBorder}>
                        <View style={style.editorView}>
                            {reply_id != threadEdit ? (
                                <View style={style.quillView}>
                                    {threadDescription ? <Text style={style.conversation}>
                                        {threadDescription}
                                    </Text> : null}
                                </View>
                            ) : (
                                <View style={{ marginTop: "1%" }}>
                                    <Pressable onPress={() => subEditFocus.current.focus()}>
                                        <View style={style.quillEditorView}>
                                            <TextInput
                                                value={threadDescription}
                                                ref={subEditFocus}
                                                multiline={true}
                                                onChangeText={(text) => {
                                                    setThreadDescription(text);
                                                }}
                                                style={style.editTextInputdescription}
                                            />
                                        </View>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                        {reply_id != threadEdit ? <View style={style.editIcon}>
                            {replyLikes && replyLikes.length > 0 && replyLikes[0].likes.includes(userSigninId) ?
                                <AntDesign name="like1" style={style.likeButton} size={20} color="blue" >{replyLikes && replyLikes.length > 0 && replyLikes[0].likes.length}</AntDesign>
                                : <AntDesign style={style.likeButton} onPress={() => { replyLike(reply[0]._id); replyLikeAPi(reply[0]._id) }} name="like2" size={20} color="black" >{replyLikes && replyLikes.length > 0 && replyLikes[0].likes.length}</AntDesign>}
                            {users_data.id == userSigninId ?
                                <AntDesign
                                    style={style.threadEditButton}
                                    onPress={() => {
                                        setThreadEdit(null);
                                        setThreadEdit(reply_id);
                                    }}
                                    name="edit"
                                    size={18}
                                    color="black"
                                />
                                : null}
                            {replies && replies.length ? (
                                <TouchableOpacity
                                    style={style.threadViewRepliesButton}
                                    onPress={() => {
                                        items.indexOf(reply_id) == -1
                                            ? setItems([...items, reply_id])
                                            : setItems(items.filter((val) => val != reply_id));
                                    }}
                                >
                                    {items.indexOf(reply_id) != -1 ? (
                                        <View>
                                            <MaterialIcons
                                                name="expand-less"
                                                size={22}
                                                color="blue"
                                            />
                                        </View>
                                    ) : (
                                        <View>
                                            {replies && replies.length ? (
                                                <View style={style.threadReplyArrowIcon}>
                                                    <Text style={{ color: "blue" }}>
                                                        ({replies && replies.length})
                                                    </Text>
                                                    <MaterialIcons
                                                        name="expand-more"
                                                        size={22}
                                                        color="blue"
                                                    />
                                                </View>
                                            ) : null}
                                        </View>
                                    )}
                                    <Text style={style.eachReply}>View replies </Text>
                                </TouchableOpacity>
                            ) : null}
                            {userSigninId ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        setThreadReply(false);
                                    }}
                                    style={style.threadReplyButton}
                                >
                                    <MaterialCommunityIcons
                                        name="reply-outline"
                                        size={20}
                                        color="black"
                                    />
                                    <Text style={style.threadReplyText}>Reply</Text>
                                </TouchableOpacity>
                            ) : null}
                            {users_data.id == userSigninId ? (
                                <AntDesign
                                    style={style.threadDeleteButton}
                                    onPress={() => {
                                        setPopupBackground(true);
                                        setIsModalVisible(true);
                                        setDeleteReply(reply_id && reply_id);
                                    }}
                                    name="delete"
                                    size={18}
                                    color="red"
                                />
                            ) : null}
                        </View> :
                            <View style={style.editIconSave}>
                                <View style={style.closeEdit}>
                                    <Text style={style.closeEditText} onPress={() => { setThreadEdit(null); setThreadDescription(html); }} >Close</Text>
                                </View>
                                <View style={style.threadSaveButton}>
                                    <TouchableOpacity activeOpacity={0.8} style={style.saveEditText}
                                        onPress={() => {
                                            setThreadEdit(null);
                                            onSubThreadSave(reply_id);
                                        }}
                                    ><Text style={style.saveText}>Save</Text></TouchableOpacity>
                                </View>
                            </View>}
                    </View>
                    <Collapsible collapsed={threadReply}>
                        <View style={style.editorView}>
                            <Pressable onPress={() => subreplyCache.current.focus()}>
                                <View style={style.quillEditorView}>
                                    <TextInput
                                        multiline={true}
                                        ref={subreplyCache}
                                        onChangeText={(text) => {
                                            setSubThreadReplyDescription(text);
                                        }}
                                        style={style.editTextInputdescription}
                                    />
                                </View>
                            </Pressable>
                            <View style={style.threadReplyCloseAndSaveView}>
                                <Text
                                    style={style.threadCloseButton}
                                    onPress={() => {
                                        setThreadReply(true);
                                        subreplyCache.current.clear();
                                    }}
                                >
                                    Close
                                </Text>
                                <TouchableOpacity activeOpacity={0.8}
                                    onPress={() => {
                                        setThreadReply(true);
                                        onSubThreadReply(reply_id);
                                    }}
                                    style={style.threadReplySaveButton}
                                >
                                    <Text style={style.saveText}>Reply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Collapsible>
                    <Collapsible collapsed={items.indexOf(reply_id) == -1 ? true : false}>
                        {replies &&
                            replies.map((item, index) => <Item key={item._id} {...item} />)}
                    </Collapsible>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        setIsModalVisible(false);
                    }}
                >
                    <View style={style.centeredView}>
                        <View style={style.modalView}>
                            <Text style={style.modalText}>
                                Do you want to delete this reply?
                            </Text>
                            <View style={style.deleteOptions}>
                                <TouchableOpacity activeOpacity={0.8} style={style.button} onPress={() => deleteReplies()}>
                                    <Text style={style.textStyle}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8}
                                    style={style.button}
                                    onPress={() => { setIsModalVisible(false); setPopupBackground(false); }}
                                >
                                    <Text style={style.textStyle}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );

    }
    const Tab = () => {
        if (conversationData) {
            let html = conversationData.description;
            let date2 = new Date();
            var date1 = new Date(conversationData.current_date_time);
            var delta = Math.abs(date1 - date2) / 1000;
            // calculate (and subtract) whole days
            var days = Math.floor(delta / 86400);
            delta -= days * 86400;
            // calculate (and subtract) whole hours
            var hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;
            // calculate whole minutes
            let minutes = Math.floor(delta / 60) % 60;
            return (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={style.container}>
                        <View style={style.conversationHeaderOuter}>
                            <View style={style.userNameDetails}>
                                <View style={style.userView}>
                                    {conversationData.user_data ? (
                                        !conversationData.user_data.image ? (
                                            <Text style={style.user}>
                                                {conversationData.user_data.name.charAt(0).toUpperCase()}
                                            </Text>
                                        ) : (
                                            <Image
                                                style={style.userImage}
                                                source={{ uri: conversationData.user_data.image }}
                                            />
                                        )
                                    ) : null}
                                </View>
                                <View style={style.editorView}>
                                    <Text style={style.userName}>
                                        {conversationData.user_data
                                            ? conversationData.user_data.name[0].toUpperCase() +
                                            conversationData.user_data.name.slice(1)
                                            : null}
                                    </Text>
                                    {days > 0 ? (
                                        <Text style={style.time}>{days} Day(s) Ago</Text>
                                    ) : hours > 0 ? (
                                        <Text style={style.time}>{hours} Hour(s) Ago</Text>
                                    ) : (
                                        <Text style={style.time}>{minutes} Min(s) Ago</Text>
                                    )}
                                </View>
                            </View>
                            <View>
                                <Text style={{ fontSize: 13, color: "black" }}>
                                    MEMBER SINCE
                                </Text>
                                <Text style={style.date}>
                                    {moment(`${conversationData.user_data.current_date_time}`).format(
                                        "YYYY-MM-DD"
                                    )}
                                </Text>
                            </View>
                        </View>
                        <View style={style.conversationContent}>
                            {!editOption ? (
                                <View>
                                    <Text style={style.conversationTitle}>
                                        {conversationData.title}
                                    </Text>
                                    <Text style={style.conversation}>
                                        {conversationData.description}
                                    </Text>
                                </View>
                            ) : (
                                <View style={style.editorView}>
                                    <TextInput
                                        value={title}
                                        onChangeText={(text) => {
                                            setTitle(text);
                                        }}
                                        style={style.editTextInputTitle}
                                    />
                                    <Pressable onPress={() => editFocus.current.focus()}>
                                        <View style={style.quillEditorView}>
                                            <TextInput
                                                value={description}
                                                ref={editFocus}
                                                multiline={true}
                                                onChangeText={(text) => {
                                                    setDescription(text);
                                                }}
                                                style={style.editTextInputdescription}
                                            />
                                        </View>
                                    </Pressable>
                                </View>
                            )}
                            {!editOption ?
                                <View style={style.editIconOuter}>
                                    {userLikes.includes(userSigninId) ? <AntDesign name="like1" style={style.likeButton} size={20} color="blue" >{userLikes.length && userLikes.length}</AntDesign> : <AntDesign style={style.likeButton} onPress={() => threadLikes(conversationData._id)} name="like2" size={20} color="black">{conversationData.likes && userLikes.length}</AntDesign>}
                                    {userSigninId == conversationData.user_data.id ?
                                        <AntDesign
                                            style={style.editButton}
                                            onPress={() => setEditOption(true)}
                                            name="edit"
                                            size={18}
                                            color="black"
                                        /> : null}
                                    {userSigninId ? (
                                        <TouchableOpacity
                                            onPress={() => setReply(false)}
                                            style={style.replyButton}
                                        >
                                            <MaterialCommunityIcons
                                                name="reply-outline"
                                                size={20}
                                                color="black"
                                            />
                                            <Text style={style.replyText}>Reply</Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </View> :
                                <View style={style.editIconOuterSave}>
                                    <View style={style.closeEdit}>
                                        <Text style={style.closeEditText} onPress={() => { setEditOption(false); setForumPageLoading(!forumPageLoading); }}>Close</Text>
                                    </View>
                                    <View style={style.saveButton}>
                                        <TouchableOpacity activeOpacity={0.8}
                                            style={style.saveEditText}
                                            onPress={() => {
                                                setEditOption(false);
                                                setConversationLoading(true);
                                                onSaveThread(conversationData._id);
                                            }}
                                        ><Text style={style.saveText}>Save</Text></TouchableOpacity>
                                    </View>
                                </View>
                            }
                            <Collapsible collapsed={reply}>
                                <Pressable onPress={() => replyCache.current.focus()}>
                                    <View style={style.quillEditorView}>
                                        <TextInput
                                            multiline={true}
                                            ref={replyCache}
                                            placeholder={"Type Here ..."}
                                            onChangeText={(text) => {
                                                setReplyDescription(text);
                                            }}
                                            style={style.editTextInputdescription}
                                        />
                                    </View>
                                </Pressable>
                                <View style={style.replyBoxView}>
                                    <TouchableOpacity activeOpacity={0.8}
                                        style={style.closeButton}
                                        onPress={() => { setReply(true); replyCache.current.clear(); }}
                                    >
                                        <Text style={style.replyText}>Close</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.8}
                                        onPress={() => {
                                            setReply(true);
                                            onReply(conversationData._id);
                                            setReplyDescription(null);
                                        }}
                                        style={style.saveReplyButton}
                                    >
                                        <Text style={style.saveText}>Reply</Text>
                                    </TouchableOpacity>
                                </View>
                            </Collapsible>
                            <Collapsible collapsed={false}>
                                {conversationData.replies &&
                                    conversationData.replies.map((item, index) => (
                                        <View>
                                            <Item key={index} {...item} />
                                        </View>
                                    ))}
                            </Collapsible>
                        </View>
                    </View>
                </ScrollView>
            );
        }
    };
    return (
        <View style={style.moreComponent}>
            {popupBackground ? <View style={style.popupBackground}></View> : null}
            <View style={style.logoAndBackButton}>
                <TouchableOpacity onPress={() => props.navigation.navigate('forum')}>
                    <AntDesign style={style.icon} name='arrowleft' size={24} color='black' />
                </TouchableOpacity>
                <View style={style.threadView}>
                    <Image style={style.coinMomoLogo} source={IMAGE_PATH.logo} />
                </View>
                <TouchableOpacity onPress={() => props.navigation.navigate(userSigninId ? 'forumCreate' : 'portfolio', { forum: 'forumCreate' })}>
                    <View style={style.threadViewIcon}>
                        <MaterialIcons style={style.threadIcon} name="post-add" size={27} color="#3F51B5" />
                        <Text style={style.newThreadText}>New Thread</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {conversationLoading ? (
                <View style={style.loadingView}>
                    <View style={style.loading}>
                    </View>
                    <ActivityIndicator style={style.activityIndicator} color="blue" size={40} />
                </View>
            ) : null}
            <View style={style.conversationData}>{Tab()}</View>
        </View>
    );
}
const style = StyleSheet.create({
    editTextInputdescription: {
        maxHeight: 240,
        fontWeight: 'bold',
        color: 'black',
        margin: '2%'
    },
    icon: {
        marginTop: '16%',
        width: 20,
        marginLeft: '15%',
    },
    saveText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 15
    },
    popupBackground: {
        position: "absolute",
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "black",
        opacity: 0.5,
        height: "100%",
        width: "100%"
    },
    saveEditText: {
        paddingLeft: 12,
        fontSize: 15,
        paddingTop: 5
    },
    closeEdit: {
        marginTop: 5
    },
    closeEditText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    editTextInputTitle: {
        fontWeight: "bold",
        color: "#23239E",
        fontSize: 14,
        marginBottom: "2%",
        height: 35,
        borderWidth: 1,
        borderColor: "green",
        borderRadius: 10,
        paddingLeft: "5%",
    },
    conversationTitle: {
        fontWeight: "bold",
        color: "#23239E",
        fontSize: 14,
    },
    conversation: {
        color: 'black',
        marginVertical: '2%'
    },
    deleteOptions: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
    },
    threadReplySaveButton: {
        marginLeft: "2%",
        color: "white",
        backgroundColor: "#8fc73d",
        fontWeight: "bold",
        fontSize: 15,
        marginTop: "2%",
        paddingHorizontal: 20,
        paddingTop: 8,
        alignItems: "center",
        textAlign: "center",
        borderRadius: 50,
    },
    threadCloseButton: {
        marginTop: "2%",
        padding: 10,
        fontWeight: "bold",
        fontSize: 15,
    },
    threadReplyCloseAndSaveView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    threadDeleteButton: {
        marginRight: "4%",
    },
    threadReplyText: {
        fontWeight: "bold",
        color: "black",
    },
    threadReplyButton: {
        display: "flex",
        flexDirection: "row",
        marginRight: "5%",
    },
    threadReplyArrowIcon: {
        display: "flex",
        flexDirection: "row",
    },
    threadViewRepliesButton: {
        display: "flex",
        flexDirection: "row-reverse",
        marginLeft: "5%",
    },
    threadSaveButton: {
        borderRadius: 5,
        elevation: 2,
        marginLeft: 10,
        width: 55,
        height: 30,
        backgroundColor: '#8fc73d'
    },
    threadEditButton: {
        marginRight: "5%",
    },
    threadLikeButton: {
        marginRight: "6%",
    },
    conversationData: {
        height: "100%",
        paddingBottom: 110,
        width: "94%",
        marginLeft: "2%",
    },
    activityIndicator: {
        position: 'absolute',
        elevation: 2,
        height: "100%",
        width: "100%"
    },
    loadingView: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    loading: {
        elevation: 2,
        backgroundColor: "black",
        opacity: 0.3,
        height: "100%",
        width: "100%",
    },
    saveReplyButton: {
        marginLeft: "2%",
        color: "white",
        backgroundColor: "#8fc73d",
        fontWeight: "bold",
        fontSize: 15,
        marginTop: "2%",
        padding: 10,
        alignItems: "center",
        textAlign: "center",
        borderRadius: 5,
        elevation: 25,
    },
    closeButton: {
        marginTop: "2%",
        padding: 10,
        fontWeight: "bold",
        fontSize: 15,
    },
    replyBoxView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    deleteButton: {
        marginRight: "10%",
    },
    replyText: {
        fontWeight: "bold",
        color: "black",
    },
    likeButton: {
        marginRight: "5%",
    },
    editButton: {
        marginRight: "10%",
    },
    saveButton: {
        borderRadius: 5,
        elevation: 2,
        marginLeft: 10,
        width: 55,
        height: 30,
        backgroundColor: '#8fc73d'
    },
    viewRepliesButton: {
        display: "flex",
        flexDirection: "row",
        marginRight: "10%",
    },
    replyButton: {
        display: "flex",
        flexDirection: "row",
        marginRight: "10%",
    },
    button: {
        borderRadius: 10,
        width: "40%",
        padding: 10,
        elevation: 2,
        backgroundColor: "#8fc73d",
    },
    modalText: {
        marginBottom: 15,
        fontSize: 18,
        textAlign: "center",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    centeredView: {
        flex: 1,
        width: "80%",
        justifyContent: "center",
        marginLeft: "10%",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    editorView: {
        width: '95%',
        paddingLeft: "2%",
    },
    userName: {
        color: "#f0438b",
        fontWeight: "bold",
        fontSize: 15,
    },
    userDetails: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
    },
    quillEditorView: {
        marginTop: "2%",
        minHeight: 250,
        borderWidth: 1,
        borderColor: "#8fc73d",
        backgroundColor: "white",
    },
    editor: {
        flex: 1,
        padding: 0,
        borderColor: "#8fc73d",
        borderWidth: 1,
        marginHorizontal: 1,
        marginVertical: 1,
        width: "90%",
        height: 50,
        borderWidth: 1,
    },
    container: {
        height: "100%",
        backgroundColor: "white",
        padding: 10,
        paddingTop: 15,
        elevation: 50,
        marginTop: "3%",
        borderTopEndRadius: 10,
    },
    conversationHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
    },
    conversationHeaderOuter: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 2,
        borderColor: "lightgrey",
        paddingBottom: 13,
    },
    conversationContent: {
        backgroundColor: "#FFFFFF",
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
    },
    conversationUserImg: {
        borderRadius: 50,
        backgroundColor: "green",
        width: 40,
        height: 40,
        display: "flex",
        marginRight: "3%",
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        borderColor: "grey",
        borderWidth: 0.5,
    },
    conversationUserNameAndTime: {
        display: "flex",
        flexDirection: "row",
    },
    title: {
        fontWeight: "bold",
        marginBottom: 10,
        fontSize: 17,
        color: "#23239E",
    },
    replyInsideIcon: {
        borderRadius: 50,
        backgroundColor: "#FF575B",
        width: "6%",
        height: "100%",
        alignSelf: "flex-start",
    },
    replyInsideIcon1: {
        borderRadius: 50,
        backgroundColor: "green",
        width: "6%",
        height: "100%",
        alignSelf: "flex-start",
    },
    contentArea: {
        paddingLeft: 10,
        marginBottom: 4,
    },
    date: {
        fontWeight: "bold",
        fontSize: 13,
    },
    userIcon: {
        color: "white",
        textAlign: "center",
        paddingBottom: 2,
    },
    editIcon: {
        display: "flex",
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        width: "95%",
        flexDirection: "row",
        backgroundColor: "lightgrey",
    },
    editIconSave: {
        display: "flex",
        justifyContent: 'flex-end',
        padding: 10,
        width: "100%",
        flexDirection: "row",
        backgroundColor: "lightgrey",
    },
    editIconOuter: {
        display: "flex",
        padding: 10,
        width: "100%",
        flexDirection: "row",
        backgroundColor: "lightgrey",
    },
    editIconOuterSave: {
        marginLeft: '2%',
        display: "flex",
        padding: 10,
        width: "98%",
        flexDirection: "row",
        justifyContent: 'flex-end',
        backgroundColor: "lightgrey",
    },
    userNameInner: {
        fontWeight: "bold",
        marginLeft: 10,
    },
    mainBorder: {
        marginTop: 5,
    },
    subBorder: {
        marginTop: 2,
        borderLeftWidth: 3,
        borderLeftColor: "lightgrey",
        left: 16,
    },
    sub1: {
        marginTop: 5,
        marginLeft: 6,
    },
    sub2: {
        marginTop: 5,
        marginLeft: 12,
    },
    eachReply: {
        fontWeight: "bold",
        color: "blue",
    },
    user: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        paddingTop: "24%",
    },
    userView: {
        borderRadius: 50,
        backgroundColor: "green",
        width: 40,
        height: 40,
        display: "flex",
        marginRight: "3%",
    },
    userNameDetails: {
        display: "flex",
        flexDirection: "row",
    },
    time: {
        fontWeight: "800",
        color: "black",
    },
    timeAndCategory: {
        marginTop: 8,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "45%",
    },
    threadIcon: {
        marginRight: '6%',
    },
    newThreadText: {
        color: "#F75626",
        fontWeight: "bold",
        fontSize: 13,
        marginLeft: '1%',
    },
    threadViewIcon: {
        display: "flex",
        alignItems: "flex-end",
        alignSelf: "flex-end",
        width: "100%",
        marginLeft: "60%",
        marginTop: 3
    },
    logoAndBackButton: {
        display: "flex",
        flexDirection: "row",
        marginTop: 25,
        height: 75,
        backgroundColor: "white",
        paddingTop: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "black",
    },
    threadView: {
        zIndex: -1,
        position: "absolute",
        width: "100%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 13,
    },
    coinMomoLogo: {
        height: 40,
        width: 150,
    },
    Icon: {
        width: 40,
        paddingLeft: 10,
    },
    moreComponent: {
        height: "100%",
    },
    threadConversation: {
        marginTop: "3%",
        marginLeft: "3%",
    },
});