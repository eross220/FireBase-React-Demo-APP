import './App.css';
import {useEffect, useState} from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child,  set, onChildChanged, onChildRemoved, onChildAdded  } from 'firebase/database';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS


const firebaseConfig = {
  apiKey: "AIzaSyBpLSmpz95CkBIF5u69ckcEqmt9CyNWwwg",
  authDomain: "acer-demo.firebaseapp.com",
  projectId: "acer-demo",
  storageBucket: "acer-demo.appspot.com",
  messagingSenderId: "969542880518",
  appId: "1:969542880518:web:02cdb51d1a2d879f086287",
  measurementId: "G-051663NCQL"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app)
const usersRef = ref(database, 'users');

for(var i= 0; i<10; i++){
  const userRef = child(usersRef, `${i}`);
  const userData = {
    name:`John Doe ${i}`,
    email:`johndoe${i}@gmail.com`
  }
  set(userRef, userData);
}


function App() {
  const [status, setStatus] = useState(''); // State to track 

  useEffect(() => {

    // Listen for removed children
    const addListener = onChildAdded(usersRef, (snapshot) => {
      const newData = snapshot.val();
      console.log("Added data:", newData)

      setStatus(`Added ${newData.name}-${newData.email}`); // Update status for added item
      // toast.success(`New item added: ${newData.name}`);
      
    });

    // Child Removed
    const removeListener = onChildRemoved(usersRef, (snapshot) => {
      const removedData = snapshot.val();
      console.log("Removed data:",removedData)

      setStatus(`Removed ${removedData.name}-${removedData.email}`); // Update status for removed item
      // toast.error(`Item removed: ${removedData.name}`);
    });

    // Child Updated
    const updateListener = onChildChanged(usersRef, (snapshot) => {
      const updatedData = snapshot.val();
      console.log("Updated data:", updatedData)

      setStatus(`Updated ${updatedData.name}-${updatedData.email}`); // Update status for updated item
      // toast.info(`Item updated: ${updatedData.name}`);
    });
    // Cleanup listeners
    return () => {
      addListener();
      removeListener();
      updateListener();
    };

  }, []);

  
  return (
    <div className="App" style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#f0f2f5',
      padding: '20px'
    }}>
    
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        width: '400px',
        textAlign: 'center'
      }}>
      
      {status && 
        <div className="status-message" style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#333',
            backgroundColor: '#e7f3fe',
            borderRadius: '8px',
            padding: '15px',
            width: '100%',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
          Event: {status}
        </div>
      }
      
      <div style={{
        fontSize: '16px',
        color: '#777'
      }}>
        Waiting for event triggers from firebase server...
      </div>
    </div>
  </div>
  
  );
}

export default App;

