import React from "react";
import styled from "styled-components";
import "./App.css";

const ContainerTarefa = styled.div`
  display: flex;
  justify-content: space-between;
`;
const BotaoApagar = styled.button`
  height: 20px;
`;

const InputsContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 10px;
  margin-bottom: 5px;
`;

const TarefaList = styled.ul`
  padding: 0;
  width: 200px;
`;

const Tarefa = styled.li`
  display: flex;
  justify-content: space-between;
  text-align: left;
  text-decoration: ${({ completa }) => (completa ? "line-through" : "none")};
  margin-bottom: 20px;
`;

export default class App extends React.Component {
  state = {
    tarefa: [],
    filtro: "",
    inputValue: "",
    filtroNome: "",
    sort: "Crescente"
  };

  componentDidUpdate() {
    const salvarTarefas = this.state.tarefa;
    localStorage.setItem("listaTarefas", JSON.stringify(salvarTarefas));
  }

  componentDidMount() {
    if (localStorage.getItem("listaTarefas")) {
      const tarefasLS = localStorage.getItem("listaTarefas");
      const tarefasObjetos = JSON.parse(tarefasLS);

      this.setState({
        tarefa: tarefasObjetos,
      });
    }
  }

  OnChangeInput = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  criarTarefa = () => {
    const novasTarefas = [...this.state.tarefa];
    novasTarefas.push({
      id: Date.now(),
      texto: this.state.inputValue,
      completa: false,
    });
    this.setState({
      tarefa: novasTarefas,
      inputValue: "",
    });
    console.log(this.state.tarefa);
  };

  selectTarefa = (id) => {
    const tarefaSelecionada = this.state.tarefa.map((tarefa) => {
      if (id === tarefa.id) {
        const mudaStatusTarefa = {
          ...tarefa,
          completa: !tarefa.completa,
        };
        return mudaStatusTarefa;
      } else {
        return tarefa;
      }
    });
    this.setState({ tarefa: tarefaSelecionada });
  };

  OnChangeFilter = (event) => {
    this.setState({ filtro: event.target.value });
  };

  OnChangeFiltroNome = (event) => {
    this.setState({ filtroNome: event.target.value });
  };

  onChangeSort = (event) => {
    this.setState({sort: event.target.value})
  }

  Filtros = () => {
    return this.state.tarefa
    .filter((tarefas) => this.state.filtroNome? tarefas.texto.includes(this.state.filtroNome): true)
    .filter((tarefas) => {
      switch (this.state.filtro) {
        case "Pendentes":
          return !tarefas.completa;
        case "Completas":
          return tarefas.completa;
        default:
          return true;
      }
    })
  }

  apagarTarefa = (id) => {
    const filtraLista = this.state.tarefa.filter((tarefa) => {
      return id !== tarefa.id;
    });
    this.setState({
      tarefa: filtraLista,
    });
  };

  render() {
    const retornaFiltros = this.Filtros()

    return (
      <div className="App">
        <h1>Tarefas do dia</h1>
        <InputsContainer>
          <input
            placeholder={"Tarefa"}
            value={this.state.inputValue}
            onChange={this.OnChangeInput}
          />
          <button onClick={this.criarTarefa}>Adicionar</button>
        </InputsContainer>
        <br />
        <InputsContainer>
          <label>Filtrar por status</label>
          <select value={this.state.filtro} onChange={this.OnChangeFilter}>
            <option>Nenhum</option>
            <option>Pendentes</option>
            <option>Completas</option>
          </select>
        </InputsContainer>
        <InputsContainer>
          <label>Filtrar por nome</label>
          <input
            value={this.state.filtroNome}
            onChange={this.OnChangeFiltroNome}
          />
        </InputsContainer>
        <TarefaList>
          {retornaFiltros.map((tarefa) => {
            return (
              <ContainerTarefa>
                <Tarefa
                  completa={tarefa.completa}
                  onClick={() => this.selectTarefa(tarefa.id)}
                >
                  {tarefa.texto}
                </Tarefa>
                <BotaoApagar onClick={() => this.apagarTarefa(tarefa.id)}>
                  X
                </BotaoApagar>
              </ContainerTarefa>
            );
          })}
        </TarefaList>
      </div>
    );
  }
}
