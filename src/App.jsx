import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

// Adventure Code: El Desafío del Apunte (versión dinosaurio de Google) — todo el juego en un solo archivo.
// Secciones: 1) funciones auxiliares  2) datos de los desafíos  3) componentes  4) App (estado y pantallas)

// ======================= 1) FUNCIONES AUXILIARES (sentencias de control) =======================
// Funciones auxiliares con las sentencias de control del juego.

const VIDAS_INICIALES = 3;
const PUNTOS_POR_DESAFIO = 100;
const BONUS_POR_VIDA = 50;

// if: el juego no inicia con un nombre vacío.
function validarNombre(nombre) {
  if (nombre.trim().length === 0) {
    return false;
  }
  return true;
}

// Desafío 1: compara el texto ingresado con las respuestas válidas.
function validarTexto(respuesta, validas) {
  const limpia = respuesta.trim().toLowerCase();
  return validas.includes(limpia);
}

// Desafíos 2 y 3: opción elegida vs. opción correcta.
function validarOpcion(elegida, correcta) {
  return elegida === correcta;
}

// switch: título según las vidas que quedaron.
function tituloPorVidas(vidas) {
  switch (vidas) {
    case 3:
      return "Dino Leyenda";
    case 2:
      return "Dino Veloz";
    case 1:
      return "Dino Sobreviviente";
    default:
      return "Dino Fósil";
  }
}

// if / else if / else: mensaje personalizado según el rendimiento.
function mensajeFinal(nombre, puntos, vidas) {
  if (puntos >= 400) {
    return `¡Excelente, ${nombre}! Dominás las sentencias de control.`;
  } else if (puntos >= 300) {
    return `¡Muy bien, ${nombre}! Llegaste a la meta con ${vidas} vida(s).`;
  } else {
    return `Lo lograste, ${nombre}, pero repasá el apunte para la próxima.`;
  }
}

// ======================= 2) DATOS DE LOS DESAFÍOS (editar con las preguntas del apunte) =======================
// Cada desafío se activa cuando el dino alcanza el `metro` indicado.
const DESAFIOS = [
  {
    id: 1,
    metro: 200,
    tipo: "texto",
    titulo: "Desafío 1: completá el código",
    consigna: 'Completá el operador ternario para que muestre "Mayor" si edad >= 18.',
    codigo: 'const mensaje = edad >= 18 ___ "Mayor" : "Menor";',
    respuestasValidas: ["?"],
    pista: "Es el símbolo que separa la condición del valor cuando es verdadera.",
    explicacion: "condicion ? valorSiVerdadero : valorSiFalso",
  },
  {
    id: 2,
    metro: 450,
    tipo: "opcion",
    titulo: "Desafío 2: renderizado condicional",
    pregunta: "Con vidas = 0, ¿qué renderiza React en este código?",
    codigo: "{vidas > 0 && <p>Seguís vivo</p>}",
    opciones: ["El texto «Seguís vivo»", "Nada (false no se renderiza)", "Un error de sintaxis", "El número 0"],
    correcta: 1,
    explicacion: "vidas > 0 da false y React no dibuja false. (Ojo: {vidas && ...} sí dibujaría el 0).",
  },
  {
    id: 3,
    metro: 750,
    tipo: "camino",
    titulo: "Desafío 3: elegí tu camino",
    pregunta: "El desierto se divide en dos. ¿Por dónde seguís?",
    caminos: {
      a: {
        etiqueta: "Cueva del switch",
        pregunta: "En un switch, ¿qué pasa si olvidás el break de un case?",
        codigo: null,
        opciones: ["Da error", "Se ejecuta también el siguiente case", "Se salta el default", "Se reinicia el switch"],
        correcta: 1,
        explicacion: "Sin break ocurre el «fall-through»: sigue ejecutando los cases de abajo.",
      },
      b: {
        etiqueta: "Bosque del if/else",
        pregunta: "Si nota = 7, ¿qué devuelve este código?",
        codigo: 'if (nota >= 9) return "Sobresaliente";\nelse if (nota >= 7) return "Satisfactorio";\nelse return "En desarrollo";',
        opciones: ["Sobresaliente", "Satisfactorio", "En desarrollo", "undefined"],
        correcta: 1,
        explicacion: "7 no cumple nota >= 9, pero sí nota >= 7: entra al primer else if que sea verdadero.",
      },
    },
  },
];

// ======================= 3a) PANTALLA INICIAL =======================
function StartScreen({ onStart }) {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarNombre(nombre)) {
      onStart(nombre.trim());
    } else {
      setError(true);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h1>Adventure Code</h1>
      <p className="sub">El Desafío del Apunte</p>
      <p>Corré con el dino y esquivá los cactus (Espacio / ↑ / tocar) y respondé los desafíos de sentencias de control. Tenés 3 vidas.</p>
      <input
        value={nombre}
        placeholder="Tu nombre"
        onChange={(e) => {
          setNombre(e.target.value);
          setError(false);
        }}
      />
      {error && <p className="error">Ingresá tu nombre para empezar.</p>}
      <button type="submit">Jugar</button>
    </form>
  );
}

// ======================= 3b) DESAFÍOS =======================
function Challenge({ desafio, onCorrecto, onIncorrecto }) {
  const [texto, setTexto] = useState("");
  const [camino, setCamino] = useState(null); // 'a' | 'b' | null
  const [feedback, setFeedback] = useState(null); // { ok, msg } | null

  // Pregunta activa: en el desafío 3 depende del camino elegido.
  const pregunta = desafio.tipo === "camino" && camino ? desafio.caminos[camino] : desafio;

  const resolver = (esCorrecta) => {
    if (esCorrecta) {
      setFeedback({ ok: true, msg: `¡Correcto! ${pregunta.explicacion}` });
    } else {
      setFeedback({ ok: false, msg: "Incorrecto, perdés una vida." });
      onIncorrecto(); // si quedan 0 vidas, App cambia a Game Over
    }
  };

  const handleTexto = (e) => {
    e.preventDefault();
    resolver(validarTexto(texto, desafio.respuestasValidas));
  };

  const handleOpcion = (i) => {
    if (feedback === null) resolver(validarOpcion(i, pregunta.correcta));
  };

  const reintentar = () => {
    setFeedback(null);
    setTexto("");
  };

  return (
    <div className="overlay">
      <div className="panel challenge">
        <h2>{desafio.titulo}</h2>

        {desafio.tipo === "camino" && camino === null ? (
          <>
            <p>{desafio.pregunta}</p>
            {Object.entries(desafio.caminos).map(([clave, c]) => (
              <button key={clave} onClick={() => setCamino(clave)}>{c.etiqueta}</button>
            ))}
          </>
        ) : (
          <>
            <p>{desafio.tipo === "texto" ? desafio.consigna : pregunta.pregunta}</p>
            {pregunta.codigo && <pre>{pregunta.codigo}</pre>}

            {desafio.tipo === "texto" ? (
              <form onSubmit={handleTexto}>
                <input value={texto} onChange={(e) => setTexto(e.target.value)} disabled={feedback?.ok} placeholder="Escribí el símbolo" />
                <button type="submit" disabled={feedback?.ok}>Responder</button>
              </form>
            ) : (
              pregunta.opciones.map((op, i) => (
                <button key={i} className="opcion" onClick={() => handleOpcion(i)} disabled={feedback !== null}>
                  {op}
                </button>
              ))
            )}

            {feedback && <p className={feedback.ok ? "ok" : "error"}>{feedback.msg}</p>}
            {feedback && !feedback.ok && desafio.tipo === "texto" && <p className="pista">Pista: {desafio.pista}</p>}
            {feedback &&
              (feedback.ok ? (
                <button onClick={onCorrecto}>Seguir corriendo</button>
              ) : (
                <button onClick={reintentar}>Reintentar</button>
              ))}
          </>
        )}
      </div>
    </div>
  );
}

// ======================= 3c) JUEGO (dinosaurio de Google corriendo y saltando) =======================
// Sprites dibujados "pixel a pixel": cada '#' es un cuadradito del dinosaurio / cactus.
const DINO_CUERPO = [
  ".........##########",
  ".........############",
  ".........##.#########",
  ".........############",
  ".........############",
  ".........########",
  ".........#######",
  "#.......########",
  "##.....##########",
  "###...############",
  "####.#############.#",
  "#################.##",
  ".#################",
  "..###############",
  "...#############",
  "....###########",
  ".....##########",
  "......########",
];
const PATAS_A = ["......###.###", "......###.#", "......###", "......####"];
const PATAS_B = ["......###.###", "......#..####", "......#...###", "......#...####"];
const CACTUS = [
  "....###....", "....###....", ".#..###..#.", ".#..###..#.", ".#..###..#.", ".#..###..#.",
  ".#########.", "..#######..", "....###....", "....###....", "....###....", "....###....",
  "....###....", "....###....", "....###....",
];

function Pixeles({ filas, y0 = 0 }) {
  const rects = [];
  filas.forEach((fila, y) =>
    [...fila].forEach((c, x) => {
      if (c === "#") rects.push(<rect key={`${x}-${y}`} x={x} y={y + y0} width="1" height="1" />);
    })
  );
  return <>{rects}</>;
}

const ANCHO = 700;
const DINO_X = 40;
const DINO_W = 44;
const GRAVEDAD = 0.6;
const SALTO = 11.5;

// Obstáculo nuevo: uno o dos cactus juntos, chicos o grandes.
function nuevoObstaculo() {
  const escala = Math.random() < 0.5 ? 2 : 3;
  const cantidad = Math.random() < 0.35 ? 2 : 1;
  return { x: ANCHO + 150 + Math.random() * 250, w: cantidad * 11 * escala, h: 15 * escala, n: cantidad };
}

// El loop usa refs (no useState) para no re-renderizar 60 veces por segundo.
function DinoGame({ pausado, onChoque, onCheckpoint }) {
  const dinoRef = useRef(null);
  const obsRef = useRef(null);
  const metrosRef = useRef(null);
  const nubes = useRef([]);
  const baches = useRef([]);
  const juego = useRef({ y: 0, vy: 0, obs: { ...nuevoObstaculo(), x: ANCHO + 200 }, dist: 0, velocidad: 6, siguiente: 0 });

  // Refs "espejo": el loop corre una sola vez y necesita ver siempre los valores actuales.
  const pausadoRef = useRef(pausado);
  const choqueRef = useRef(onChoque);
  const checkRef = useRef(onCheckpoint);
  pausadoRef.current = pausado;
  choqueRef.current = onChoque;
  checkRef.current = onCheckpoint;

  const saltar = () => {
    const j = juego.current;
    if (j.y === 0 && !pausadoRef.current) j.vy = SALTO;
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        saltar();
      }
    };
    window.addEventListener("keydown", onKey);

    let raf;
    let ultimo = performance.now();
    const loop = (t) => {
      const dt = Math.min((t - ultimo) / 16.67, 3);
      ultimo = t;
      const j = juego.current;

      if (!pausadoRef.current) {
        const o = j.obs;
        j.vy -= GRAVEDAD * dt;
        j.y = Math.max(0, j.y + j.vy * dt);
        if (j.y === 0) j.vy = 0;

        o.x -= j.velocidad * dt;
        j.dist += j.velocidad * dt;
        j.velocidad = Math.min(9, j.velocidad + 0.0004 * dt);

        if (o.x < -o.w) j.obs = nuevoObstaculo();

        // Colisión: el dino toca el cactus si se superponen en X y no saltó lo suficiente.
        const choca = o.x < DINO_X + DINO_W - 10 && o.x + o.w > DINO_X + 10 && j.y < o.h - 8;
        if (choca) {
          j.obs = { ...nuevoObstaculo(), x: ANCHO + 200 };
          j.y = 0;
          j.vy = 0;
          dinoRef.current?.classList.add("herido");
          setTimeout(() => dinoRef.current?.classList.remove("herido"), 600);
          choqueRef.current();
        }

        const metros = Math.floor(j.dist / 10);
        if (j.siguiente < DESAFIOS.length && metros >= DESAFIOS[j.siguiente].metro) {
          const indice = j.siguiente;
          j.siguiente += 1;
          checkRef.current(indice);
        }
        if (metrosRef.current) metrosRef.current.textContent = String(metros).padStart(5, "0");
      }

      // Dibujo: se actualiza el DOM directamente.
      const ob = j.obs;
      if (dinoRef.current) {
        dinoRef.current.style.bottom = `${30 + j.y}px`;
        dinoRef.current.classList.toggle("corre", j.y === 0 && !pausadoRef.current);
      }
      if (obsRef.current) {
        obsRef.current.style.left = `${ob.x}px`;
        obsRef.current.style.width = `${ob.w}px`;
        obsRef.current.style.height = `${ob.h}px`;
        obsRef.current.children[1].style.display = ob.n === 2 ? "block" : "none";
      }
      baches.current.forEach((el, i) => el && (el.style.backgroundPosition = `${-j.dist * (i === 0 ? 1 : 1)}px 0`));
      nubes.current.forEach((el, i) => {
        if (el) el.style.transform = `translateX(${ANCHO + 60 - ((j.dist * (0.25 - i * 0.07) + i * 350) % (ANCHO + 120))}px)`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="escena" onPointerDown={saltar}>
      <span ref={metrosRef} className="metros">00000</span>
      <div ref={(el) => (nubes.current[0] = el)} className="nube" style={{ top: 28 }} />
      <div ref={(el) => (nubes.current[1] = el)} className="nube" style={{ top: 58 }} />
      <div className="linea" />
      <div ref={(el) => (baches.current[0] = el)} className="baches a" />
      <div ref={(el) => (baches.current[1] = el)} className="baches b" />
      <div ref={obsRef} className="obs">
        <svg viewBox="0 0 11 15" preserveAspectRatio="none" fill="#535353" shapeRendering="crispEdges"><Pixeles filas={CACTUS} /></svg>
        <svg viewBox="0 0 11 15" preserveAspectRatio="none" fill="#535353" shapeRendering="crispEdges"><Pixeles filas={CACTUS} /></svg>
      </div>
      <div ref={dinoRef} className="dino">
        <svg viewBox="0 0 22 22" width="44" height="44" fill="#535353" shapeRendering="crispEdges">
          <Pixeles filas={DINO_CUERPO} />
          <g className="patasA"><Pixeles filas={PATAS_A} y0={18} /></g>
          <g className="patasB"><Pixeles filas={PATAS_B} y0={18} /></g>
        </svg>
      </div>
    </div>
  );
}

// ======================= 3d) PANTALLA FINAL (Victoria / Game Over) =======================
function EndScreen({ victoria, nombre, puntos, vidas, onReiniciar }) {
  return (
    <div className="panel">
      {victoria ? (
        <>
          <h1>¡Victoria!</h1>
          <p className="sub">{tituloPorVidas(vidas)}</p>
          <p>{mensajeFinal(nombre, puntos, vidas)}</p>
        </>
      ) : (
        <>
          <h1>GAME OVER</h1>
          <p>El dino se quedó sin vidas, {nombre}. Repasá el apunte y volvé a intentarlo.</p>
        </>
      )}
      <p className="puntos">Puntaje final: {puntos}</p>
      <button onClick={onReiniciar}>Jugar de nuevo</button>
    </div>
  );
}

// ======================= 4) APP: useState + renderizado condicional de pantallas =======================
function App() {
  const [pantalla, setPantalla] = useState("inicio"); // inicio | juego | gameover | victoria
  const [nombre, setNombre] = useState("");
  const [vidas, setVidas] = useState(VIDAS_INICIALES);
  const [puntos, setPuntos] = useState(0);
  const [desafioActivo, setDesafioActivo] = useState(null); // índice o null

  const perderVida = () => {
    const restantes = vidas - 1;
    setVidas(restantes);
    if (restantes <= 0) {
      setDesafioActivo(null);
      setPantalla("gameover");
    }
  };

  const desafioCorrecto = () => {
    const esUltimo = desafioActivo === DESAFIOS.length - 1;
    if (esUltimo) {
      setPuntos(puntos + PUNTOS_POR_DESAFIO + vidas * BONUS_POR_VIDA);
      setPantalla("victoria");
    } else {
      setPuntos(puntos + PUNTOS_POR_DESAFIO);
    }
    setDesafioActivo(null);
  };

  const iniciar = (nombreJugador) => {
    setNombre(nombreJugador);
    setPantalla("juego");
  };

  const reiniciar = () => {
    setVidas(VIDAS_INICIALES);
    setPuntos(0);
    setDesafioActivo(null);
    setPantalla("juego");
  };

  return (
    <main className="app">
      {pantalla === "inicio" ? (
        <StartScreen onStart={iniciar} />
      ) : pantalla === "juego" ? (
        <>
          <header className="hud">
            <span>{nombre}</span>
            <span>{"♥ ".repeat(vidas)}</span>
            <span>Puntos: {puntos}</span>
          </header>
          <DinoGame
            pausado={desafioActivo !== null}
            onChoque={perderVida}
            onCheckpoint={setDesafioActivo}
          />
          {desafioActivo !== null && (
            <Challenge
              key={desafioActivo}
              desafio={DESAFIOS[desafioActivo]}
              onCorrecto={desafioCorrecto}
              onIncorrecto={perderVida}
            />
          )}
        </>
      ) : (
        <EndScreen
          victoria={pantalla === "victoria"}
          nombre={nombre}
          puntos={puntos}
          vidas={vidas}
          onReiniciar={reiniciar}
        />
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
