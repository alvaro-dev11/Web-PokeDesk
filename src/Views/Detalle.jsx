import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Badge,
  Progress,
} from "reactstrap";
import PokeTarjeta from "../Components/PokeTarjeta";

const Detalle = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState([]);
  const [especie, setEspecie] = useState([]);
  const [habitat, setHabitat] = useState("Desconocido");
  const [descripcion, setDescripcion] = useState([]);
  const [imagen, setImagen] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);
  const [evoluciones, setEvoluciones] = useState([]);
  const [listaEvoluciones, setListaEvoluciones] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [cardClass, setCardClass] = useState("d-none");
  const [loadClass, setLoadClass] = useState("");

  useEffect(() => {
    getPokemon();
  }, [id]);

  const getPokemon = async () => {
    const liga = `${import.meta.env.VITE_API_URL}/pokemon/${id}`;
    axios.get(liga).then(async (response) => {
      const respuesta = response.data;
      setPokemon(respuesta);
      if (respuesta.sprites.other.dream_world.front_default != null) {
        setImagen(respuesta.sprites.other.dream_world.front_default);
      } else {
        setImagen(respuesta.sprites.other["official-artwork"].front_default);
      }
      await getTipos(respuesta.types);
      await getHabilidades(respuesta.abilities);
      await getEstadisticas(respuesta.stats);
      await getEspecie(respuesta.species.name);
      setCardClass("");
      setLoadClass("d-none");
    });
  };

  const getTipos = async (tip) => {
    let listaTipos = [];
    tip.forEach((t) => {
      axios.get(t.type.url).then(async (response) => {
        listaTipos.push(response.data.names[5].name);
        setTipos(listaTipos);
      });
    });
  };

  const getEstadisticas = async (es) => {
    let listaEs = [];
    es.forEach((e) => {
      axios.get(e.stat.url).then(async (response) => {
        listaEs.push({
          nombre: response.data.names[5].name,
          valor: e.base_stat,
        });
        setEstadisticas(listaEs);
      });
    });
  };

  const getHabilidades = async (hab) => {
    let listaHab = [];
    hab.forEach((h) => {
      axios.get(h.ability.url).then(async (response) => {
        listaHab.push(response.data.names[5].name);
        setHabilidades(listaHab);
      });
    });
  };

  const getEspecie = async (esp) => {
    const liga = `${import.meta.env.VITE_API_URL}/pokemon-species/${esp}`;
    axios.get(liga).then(async (response) => {
      const respuesta = response.data;
      setEspecie(respuesta);
      if (respuesta.habitat != null) {
        await getHabitat(respuesta.habitat.url);
      }
      await getDescripcion(respuesta.flavor_text_entries);
      await getEvoluciones(respuesta.evolution_chain.url);
    });
  };

  const getHabitat = async (hab) => {
    axios.get(hab).then(async (response) => {
      setHabitat(response.data.names[1].name);
    });
  };
  const getEvoluciones = async (ev) => {
    axios.get(ev).then(async (response) => {
      const respuesta = response.data;
      let lista = respuesta.chain.species.url.replace("-species", "");
      lista += procesaEvoluciones(respuesta.chain);
      setEvoluciones(lista);
      let apoyo = lista.split(" ");
      let list = [];
      apoyo.forEach((ap) => {
        if (ap != "") {
          list.push({ url: ap });
        }
      });
      setListaEvoluciones(list);
    });
  };
  const procesaEvoluciones = async (info) => {
    let res = " ";
    if (info.evolves_to.length > 0) {
      res += info.evolves_to[0].species.url.replace("-species", "");
      return res + " " + procesaEvoluciones(info.evolves_to[0]);
    } else {
      return res;
    }
  };
  const getDescripcion = async (desc) => {
    let texto = "";
    desc.forEach((d) => {
      // Verificando que la descripción sea en español
      if (d.language.name == "es") {
        texto = d.flavor_text;
      }
      if ((texto = "" && desc.length > 0)) {
        texto = desc[0].flavor_text;
      }
    });
    setDescripcion(texto);
  };

  return (
    <Container className="bg-danger mt-3">
      <Row>
        <Col>
          <Card className="shadow mt-3 mb-3">
            <CardBody className="mt-3">
              <Row>
                <Col className="text-end">
                  <Link to={"/"} className="btn btn-warning">
                    <i className="fa-solid fa-home"></i>Inicio
                  </Link>
                </Col>
              </Row>
              <Row className={loadClass}>
                <Col md="12">
                  <img
                    src="/img/Pokemon-loading.gif"
                    className="w-100"
                    alt=""
                  />
                </Col>
              </Row>
              <Row className={cardClass}>
                <Col md="6">
                  <CardText className="h1 text-capitalize">
                    {pokemon.name}
                  </CardText>
                  <CardText className="fs-3">{descripcion}</CardText>
                  <CardText className="fs-5">
                    Altura: <b>{pokemon.height / 10} m</b>
                    Peso: <b>{pokemon.weight / 10} kg</b>
                  </CardText>
                  <CardText className="fs-5">
                    Tipo:
                    {tipos.map((tip, i) => (
                      <Badge pill className="me-1" color="danger" key={i}>
                        {tip}
                      </Badge>
                    ))}
                  </CardText>
                  <CardText className="fs-5">
                    Habilidades:
                    {habilidades.map((hab, i) => (
                      <Badge pill className="me-1" color="dark" key={i}>
                        {hab}
                      </Badge>
                    ))}
                  </CardText>
                  <CardText className="fs-5 text-capitalize">
                    Habitat: <b>{habitat}</b>
                  </CardText>
                </Col>
                <Col md="6">
                  <img src={imagen} className="img-fluid animate__animated animate__backInRight" />
                </Col>
                <Col md="12 mt-3">
                  <CardText className="fs-4 text-center">
                    <b>Estadísticas</b>
                  </CardText>
                </Col>
                {estadisticas.map((es, i) => (
                  <Row key={i}>
                    <Col xs="6" md="3">
                      <b>{es.nombre}</b>
                    </Col>
                    <Col xs="6" md="9">
                      <Progress className="my-2" value={es.valor}>
                        {es.valor}
                      </Progress>
                    </Col>
                  </Row>
                ))}
                <Col md="12 mt-3">
                  <CardText className="fs-4 text-center">
                    <b>Cadena de Evolución</b>
                  </CardText>
                  {/* {listaEvoluciones.map((pok, i) => (
                    <PokeTarjeta poke={pok} key={i} />
                  ))} */}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Detalle;
