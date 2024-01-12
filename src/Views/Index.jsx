import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupText,
  Input,
} from "reactstrap";
import axios from "axios";
import { useState, useEffect } from "react";
import PokeTarjeta from "../Components/PokeTarjeta";
import { PaginationControl } from "react-bootstrap-pagination-control";

const Index = () => {
  const [pokemones, setPokemones] = useState([]);
  const [allPokemones, setAllPokemones] = useState([]); // Mostrar todos los pokemones
  const [listado, setlistado] = useState([]);
  const [filtro, setFiltro] = useState(""); // Valor del input
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getPokemones(offset);
    getAllPokemones();
  }, []);

  // Funcion para consumir la API de PokeAPI
  const getPokemones = async (o) => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/pokemon?offset=${o}&limit=${limit}`;
    axios.get(url).then(async (res) => {
      const response = res.data;
      setPokemones(response.results);
      setlistado(response.results);
      setTotal(response.count);
    });
  };

  // Funcion para consumir la API de PokeAPI con mas de 10000 pokemones
  const getAllPokemones = async () => {
    const url = `${import.meta.env.VITE_API_URL}/pokemon?offset=0&limit=100000`;
    axios.get(url).then(async (res) => {
      const response = res.data;
      setAllPokemones(response.results);
    });
  };

  const buscar = async (e) => {
    // Si el codigo de la tecla es 13 es decir enter
    if (e.keyCode == 13) {
      if (filtro.trim() != "") {
        setlistado([]);
        setTimeout(() => {
          setlistado(allPokemones.filter((p) => p.name.includes(filtro)));
        }, 100);
      }
    } else if (filtro.trim() == "") {
      setlistado([]);
      setTimeout(() => {
        setlistado(pokemones);
      }, 100);
    }
  };

  const goPage = async (p) => {
    setlistado([]);
    await getPokemones(p == 1 ? 0 : (p - 1) * 20); // mostrar 20 pokemones por pagina
    setOffset(p);
  };

  return (
    <Container className="shadow bg-danger mt-3">
      <Row className="animate__animated animate__backInDown">
        <Col>
          <InputGroup className="mt-3 mb-3 shadow">
            <InputGroupText>
              <i className="fa-solid fa-search"></i>
            </InputGroupText>
            <Input
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              onKeyUpCapture={buscar}
              placeholder="Buscar pokemon"></Input>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        {listado.map((pok, i) => (
          <PokeTarjeta poke={pok} key={i} />
        ))}
        {listado.length == 0 ? (
          <Col className="text-center fs-2 mb-3">No hay coincidencias</Col>
        ) : (
          ""
        )}
        <PaginationControl
          last={true}
          limit={limit}
          total={total}
          page={offset}
          changePage={(page) => goPage(page)}
        />
      </Row>
    </Container>
  );
};

export default Index;
