import { useState } from "react";
import { useGlobalState } from "../../contexts/globalStateContext";
import axiosInstance from "../../services/instanceAxios";
import { useNavigate } from "react-router-dom";

const GRID_SIZE = 10;
const PUBLIC_URL = "src/assets/";

function GridInspection() {
  const [selectedSquares, setSelectedSquares] = useState<number[]>([]);
  const [selectedValues, setSelectedValues] = useState<number[]>([]);
  const { setupInf, setSetupInf } = useGlobalState();
  const navigate = useNavigate();

  const changeColor = (cell: HTMLElement | null) => {
    if (cell) {
      cell.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
    }
  };

  const createSetup = async (list: any[]) => {
    setSetupInf((prevSetupInf) => ({
      ...prevSetupInf,
      gridList: selectedSquares,
    }));

    await axiosInstance
      .post("post", {
        customer: setupInf.customer,
        serviceOrder: setupInf.serviceOrder,
        amauntMemory: setupInf.amauntMemory,
        typeMemory: setupInf.typeMemory,
        inspectionMode: setupInf.inspectionMode,
        gridList: list,
      })
      .then((res) => {
        console.log(res);
        setSetupInf({
          customer: "1",
          serviceOrder: "null",
          amauntMemory: "null",
          typeMemory: "udimm",
          inspectionMode: 1,
          gridList: [],
        });
        navigate("/");
      })
      .catch((res) => console.log(res + " " + setupInf));
  };

  const handleCellClick = (row: number, col: number) => {
    const number = row * GRID_SIZE + col;
    setSelectedSquares([...selectedSquares, number]);
    setSelectedValues([...selectedValues, number]);
    console.log(`Número selecionado: ${number}`);
    changeColor(document.getElementById(`cell-${row}-${col}`));
  };

  const handleSaveButtonClick = () => {
    console.log("Valores selecionados:");
    console.log(selectedValues);
    console.log("Enviando os valores para o servidor...");
    selectedValues.forEach((number) => {
      const cell = document.getElementById(
        `cell-${Math.floor(number / GRID_SIZE)}-${number % GRID_SIZE}`
      );

      if (cell) {
        cell.style.backgroundColor = "rgba(0, 0, 255, 0.2)";
      }
    });
    createSetup(selectedValues);
  };

  const handleBackButtonClick = () => {
    setSetupInf({
      customer: "1",
      serviceOrder: "null",
      amauntMemory: "null",
      typeMemory: "udimm",
      inspectionMode: 1,
      gridList: [],
    });
    document.title = "iLabeling";
    navigate("/conf");
  };

  const gridCells = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      gridCells.push(
        <div
          key={`${row}-${col}`}
          className="cell"
          id={`cell-${row}-${col}`}
          onClick={() => handleCellClick(row, col)}
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "transparent",
            border: "1px solid #0ae10a",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "18px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {/* Conteúdo da célula */}
        </div>
      );
    }
  }

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  };

  const backgroundStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${GRID_SIZE}, 100px)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, 100px)`,
    gap: "2px",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backgroundImage: `url(${PUBLIC_URL}/UDIMM.jpeg)`,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    width: `${GRID_SIZE * 100}px`,
    height: `${GRID_SIZE * 100}px`,
  };

  return (
    <div style={containerStyle}>
      <div className="grid" style={backgroundStyle}>
        {gridCells}
      </div>
      <div style={buttonContainerStyle}>
        <button
          className="rounded-button"
          onClick={handleSaveButtonClick}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            fontSize: "18px",
            backgroundColor: "#ffff",
            transition: "background-color 0.3s",
            cursor: "pointer",
            borderRadius: "10px",
          }}
        >
          Save
        </button>
        <button
          className="rounded-button"
          onClick={handleBackButtonClick}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            backgroundColor: "#ffff",
            transition: "background-color 0.3s",
            cursor: "pointer",
            borderRadius: "10px",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default GridInspection;
