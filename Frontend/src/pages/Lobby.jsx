import "../css/Lobby.css";
import { useNavigate } from "react-router-dom";

const codeBlocks = [
  { index: 1, title: "Async Case" },
  { index: 2, title: "Promises Example" },
  { index: 3, title: "Closure Challenge" },
  { index: 4, title: "Recursion Task" },
];

const Lobby = () => {
  const navigate = useNavigate();

  return (
    <div className="lobby">
      <h1>Choose code block</h1>
      <ul>
        {codeBlocks.map((block) => (
          <li key={block.index} onClick={() => navigate("/code/" + block.index)}>
            {block.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;
