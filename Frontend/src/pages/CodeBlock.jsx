import "../css/CodeBlock.css";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import axiosInstance from "../services/axiosConfig";

// Socket connection
const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ['polling', 'websocket']
});

const CodeBlock = () => {
  const { index } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("// Start coding here...");
  const [role, setRole] = useState(null);
  const [assignment, setAssignment] = useState('');  
  const [solution, setSolution] = useState(''); 
  const [isCorrect, setIsCorrect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const alertShownRef = useRef(false);

  // UseEffect to handle socket events
  useEffect(() => {
    // Reset state when joining a new room
    setRole(null);
    alertShownRef.current = false;
    
    // Connect to socket and join room
    const handleConnection = () => {
      setIsConnected(true);
      socket.emit("joinRoom", index);
    };

    if (!isConnected) {
      socket.connect();
      socket.on("connect", handleConnection);
      if (socket.connected) {
        handleConnection();
      }
    } else {
      socket.emit("joinRoom", index);
    }

    socket.on("assignRole", (assignedRole) => {
      setRole(assignedRole);
      console.log("Assigned role:", assignedRole);
    });

    socket.on("joinedRoom", (roomId) => {
      console.log("Successfully joined room:", roomId);
    });

    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socket.on("mentorLeft", () => {
      // Only show alert once to prevent loops
      if (!alertShownRef.current) {
        alertShownRef.current = true;
        alert("The mentor has left. Returning to lobby...");
        navigate("/");
      }
    });

    return () => {
      socket.emit("leaveRoom", index);
      socket.off("assignRole");
      socket.off("joinedRoom");
      socket.off("codeUpdate");
      socket.off("mentorLeft");
      socket.off("connect", handleConnection);
    };
  }, [index, navigate, isConnected]);

  // UseEffect to fetch assignment and solution
  useEffect(() => {
    axiosInstance.get(`code/${index}`)
      .then(response => {
        setAssignment(response.data.assignment);
        setSolution(response.data.solution); 
      })
      .catch(error => {
        console.error('Error fetching assignment:', error);
      });
  }, [index]);

  // Function to handle code changes
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { room: index, code: newCode });

    if (newCode === solution) {
      setIsCorrect(true); 
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="code-block">
      <h1>Code Block {index}</h1>
      <h2>Role: {role || 'Connecting...'}</h2>
      <h3>Assignment:</h3>
      <p>{assignment}</p>
      
      {isCorrect && <h1 style={{ fontSize: '100px' }}>😊</h1>}
      
      <CodeMirror
        value={code}
        extensions={[javascript()]}
        onChange={handleCodeChange}
        readOnly={role === "mentor"} 
      />
    </div>
  );
};

export default CodeBlock;