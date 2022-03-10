import React, { Component } from "react";

import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  TouchableHighlightBase,
  Alert,
 
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";



export default class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: "",
      studentId: "",
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false
    };
  }
  getCameraPermissions = async domState => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
      hasCameraPermissions: status === "granted",
      domState: domState,
      scanned: false
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    const { domState } = this.state;

    if (domState === "bookId") {
      this.setState({
        bookId: data,
        domState: "normal",
        scanned: true
      });
    } else if (domState === "studentId") {
      this.setState({
        studentId: data,
        domState: "normal",
        scanned: true
      });
    }
  };

  handleTransaction = () => {
    var { bookId } = this.state;
    await this.getBookDetails();
    await this.getStudentDetails();
    db.collection("books")
    .doc(bookId)
    .get()
    .then(doc => {
      var book = doc.data();
      if(book.is_book_available) {
        this.initiateBookIssue(studentId, studentName, bookId, bookName);
        Alert.alert("Book issued to student")
      }
        else {
          this.initiateBookReturn(studentId, studentName, bookId, bookName);
          Alert.alert("Book returned from student")
        }
    });
  };

  getBookDetails = bookId => {
    bookId = bookId.trim();
    db.collection("books")
    .where("book_id", "==", bookId)
    .get()
    .then(snapshot => {
      snapshot.docs.map(doc => {
        this.setState({
          bookName: doc.data().book_details.book_name
        });
      });
    });
  }
  getStudentDetails = studentId => {
    studentId = studentId.trim();
    db.collection("students")
    .where("student_id", "==", studentId)
    .get()
    .then(snapshot => {
      snapshot.docs.map(doc => {
        this.setState({
          studentName: doc.data().student_details.student_name
        });
      });
    });
  }
  initiateBookIssue = async (bookId, studentId, bookName, studentName) => {
    db.collection("transactions").add({
      student_id: studentId,
      student_name: studentName,
      book_id: bookId,
      book_name: bookName,
      date: firebase.firestore.Timestamp.now().toDate(),
      transaction_type: "issue"
    });
    db.collection("books")
    .doc(bookId)
    .update({
      is_book_available: false
    });
    db.collection("students")
    .doc(studentId)
    .update({
      number_of_books_issued: firebase.firestore.FieldValue.increment(1)
    });
    this.setState({
      bookId: "", 
      studentId: ""
    });
    console.log("Book issued to the student");
  };
  initiateBookReturn = () => {
    db.collection("transactions").add({
      student_id: studentId,
      student_name: studentName,
      book_id: bookId,
      book_name: bookName,
      date: firebase.firestore.Timestamp.now().toDate(),
      transaction_type: "return"
    });
    db.collection("books")
    .doc(bookId)
    .update({
      is_book_available: true
    });
    db.collection("students")
    .doc(studentId)
    .update({
      number_of_books_issued: firebase.firestore.FieldValue.increment(-1)
    });
    this.setState({
      bookId: "", 
      studentId: ""
    });
    console.log("Book returned from the student");
  };

  render() {
     const { bookId, studentId, domState, scanned } = this.state;
    if (domState !== "normal") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }
    
    return (
      <View style={styles.container}>
        
          <View style={styles.lowerContainer}>
            <View style={styles.textinputContainer}>
              <TextInput
                style={styles.textinput}
                placeholder={"Book Id"}
                placeholderTextColor={"#FFFFFF"}
                value={bookId}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.getCameraPermissions("bookId")}
              >
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.textinputContainer, { marginTop: 25 }]}>
              <TextInput
                style={styles.textinput}
                placeholder={"Student Id"}
                placeholderTextColor={"#FFFFFF"}
                value={studentId}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.getCameraPermissions("studentId")}
              >
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress = {this.handleTransaction()} >
                <Text style = {styles.buttonText}> Submit 
                </Text>
              </TouchableOpacity>
          </View>
      </View>
    );
  }
}


  const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "#FFFFFF"
 },
 lowerContainer: {
   flex: 0.5,
   alignItems: "center"
 },
 textinputContainer: {
   borderWidth: 2,
   borderRadius: 10,
   flexDirection: "row",
   backgroundColor: "#9DFD24",
   borderColor: "#FFFFFF"
 },
 textinput: {
   width: "57%",
   height: 50,
   padding: 10,
   borderColor: "#FFFFFF",
   borderRadius: 10,
   borderWidth: 3,
   fontSize: 18,
   backgroundColor: "#5653D4",
   color: "#FFFFFF"
 },
 scanbutton: {
   width: 100,
   height: 50,
   backgroundColor: "#9DFD24",
   borderTopRightRadius: 10,
   borderBottomRightRadius: 10,
   justifyContent: "center",
   alignItems: "center"
 },
 scanbuttonText: {
   fontSize: 24,
   color: "#0A0101",
 }

  
});
