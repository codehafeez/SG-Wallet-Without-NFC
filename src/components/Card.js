import React, { Component } from "react";
import {
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { ProgressDialog } from "react-native-simple-dialogs";
export default class Card extends Component {
  constructor() {
    super();
    this.state = {
      showProgress: false,
      wallet: "",
      password: ""
    };

    global.tableData = 0;
    global.tableData_1 = [];
    global.tableData_2 = [];
  }

  function_card_submt = async () => {
    const { wallet, password } = this.state;
    if (wallet === undefined) {
      Alert.alert("Error", "Please enter a wallet code.");
    } else if (password === undefined) {
      Alert.alert("Error", "Please enter a password.");
    } else {
      if (wallet.length < 1) {
        Alert.alert("Error", "Please enter a wallet code.");
      } else if (password.length < 1) {
        Alert.alert("Error", "Please enter a password.");
      } else {
        try {
          this.setState({ showProgress: true });
          const token = await AsyncStorage.getItem("session_login_token");
          return fetch("https://tklcloud.com/SGWalletX/api/v1/make_card", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            },
            body: JSON.stringify({ wallet, password })
          })
            .then(res => res.json())
            .then(resJson => {
              this.setState({ showProgress: false });
              this.setState({ wallet: "", password: "" });
              // alert(JSON.stringify(resJson));
              if (resJson.Msg === "OK") {
                Alert.alert("Success", resJson.Msg2);
                AsyncStorage.setItem("session_card", resJson.card1);
              } else {
                Alert.alert("Error", resJson.Msg2);
              }
            });
        } catch (Ex) {
          this.setState({ showProgress: false });
          Alert.alert("Error", Ex);
        }
      }
    }
  };

  function_card() {
    return (
      <ScrollView>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <View style={styles.container}>
            <Text style={styles.heading}>You can create a NFC Card</Text>
            <Text style={styles.textView}>Wallet Code</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder="Wallet Code"
              keyboardType="numeric"
              value={this.state.wallet}
              onChangeText={wallet => this.setState({ wallet })}
            />
            <Text style={styles.textView}>Password</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder="Password"
              secureTextEntry
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
            <TouchableOpacity
              onPress={this.function_card_submt}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}> Submit</Text>
            </TouchableOpacity>
          </View>
          <ProgressDialog
            activityIndicatorColor="#008CBA"
            activityIndicatorSize="large"
            animationType="slide"
            message="Please, wait..."
            visible={this.state.showProgress}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }

  render() {
    return <View>{this.function_card()}</View>;
  }
}

const styles = StyleSheet.create({
  // Every Form
  container: {
    paddingTop: 60
  },
  heading: {
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center"
  },
  heading2: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center"
  },
  input: {
    color: "#000",
    backgroundColor: "#fff",
    paddingLeft: 10,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 5,
    height: 40,
    borderColor: "#000",
    borderWidth: 1
  },
  textView: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10
  },
  submitButton: {
    marginTop: 15,
    backgroundColor: "#008CBA",
    marginLeft: 25,
    marginRight: 25,
    height: 40
  },
  submitButtonText: {
    paddingTop: 10,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "white"
  },
  transaction_view: {
    marginLeft: 5
  },
  transaction_table1: {
    marginLeft: 20,
    marginBottom: 10
  }
});
