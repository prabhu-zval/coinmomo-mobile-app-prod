import React, { useContext } from "react";
import { View, StyleSheet, Image, TouchableOpacity, TouchableHighlight, Modal, Pressable, Text } from "react-native";
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { IMAGE_PATH } from '../../utils/constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginContext } from "../../context/context";

export default function Header(props) {
  const { setUserLogin, setShowData, setUserDetails, setUserSigninId, setPopupBackground, isModalVisible, setIsModalVisible, setDrawerBgColor } = useContext(LoginContext)
  const onPressLogout = async () => {
    const logout = await AsyncStorage.removeItem('UserLogin')
    if (!logout) {
      setShowData([])
      setUserLogin(false)
      setUserDetails({})
      setUserSigninId(null)
      setIsModalVisible(false)
      setPopupBackground(false)
    }
  }
  return (
    <View style={style.header}>
      <Modal
        animationType="none"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <Text style={style.modalText}>Do you want to logout?</Text>
            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
              <Pressable
                style={style.button}
                onPress={() => onPressLogout()}
              >
                <Text style={style.textStyle}>Yes</Text>
              </Pressable>
              <Pressable
                style={style.button}
                onPress={() => { setIsModalVisible(false); setPopupBackground(false); }}
              >
                <Text style={style.textStyle}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={style.notification}>
        <TouchableOpacity onPress={() => { props.props.navigation.openDrawer(); setDrawerBgColor("market") }}>
          <Entypo name="menu" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={style.logo}>
        <Image style={style.coinmomoLogo} source={IMAGE_PATH.logo} />
      </View>
      <TouchableOpacity style={style.search} onPress={() => props.props.navigation.navigate('search')}>
        <FontAwesome5 name="search" size={25} color="black" />
      </TouchableOpacity>
    </View>
  );
}
const style = StyleSheet.create({
  loginView: {
    display: 'flex',
    flexDirection: 'row',
  },
  loginText: {
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 16
  },
  logout: {
    width: 70
  },
  logoutView: {
    display: 'flex',
    flexDirection: 'row',
  },
  logoutText: {
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 16
  },
  notification: {
    width: '25%',
    paddingTop: '4.5%',
    paddingLeft: 15
  },
  logo: {
    width: '50%',
    marginTop: '3.5%',
    paddingLeft: 23
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 70,
    width: '100%',
    marginTop: 25,
  },
  search: {
    width: '25%',
    marginTop: '5%',
    paddingLeft: 50
  },
  coinmomoLogo: {
    height: 40,
    width: 150
  },
  centeredView: {
    flex: 1,
    width: '80%',
    justifyContent: "center",
    marginLeft: '10%',
    alignItems: "center",
    marginTop: 22
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 50,
    width: '35%',
    padding: 7,
    elevation: 2,
    backgroundColor: '#3F51B5',
    marginTop: 10
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: "center"
  }
});