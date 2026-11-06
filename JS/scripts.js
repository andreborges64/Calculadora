"use strict";

let expressao = "";
let modoRadianos = true;
let escala = 100;
const incrementoEscala = 10;
const escalaMinima = 100;
const escalaMaxima = 200;

const displayConta = document.getElementById("conta");
const displayResultado = document.getElementById("resultado");
const displayModo = document.getElementById("mode");

function atualizarVisor() {
  displayConta.textContent = expressao
    .replace(/\b(sin|cos|tan|asin|acos|atan|sqrt|log|ln)\(/g, "$1(")
    .replace(/\*/g, "×")
    .replace(/\//g, "÷")
    .replace(/\bpi\b/g, "π")
    .replace(/\bE\b/g, " × 10^");
}

function inserirDigito(digito) {
  iniciarNovaExpressaoSeNecessario();
  expressao += digito;
  displayResultado.textContent = "";
  atualizarVisor();
}

function adicionarNumero(numero) {
  inserirDigito(String(numero));
}

function adicionarDigito(digito) {
  iniciarNovaExpressaoSeNecessario();
  if (digito === "." && /\d*\.?\d*$/.test(expressao.split(/[+\-*/^(),]/).pop()) &&
      expressao.split(/[+\-*/^(),]/).pop().includes(".")) return;
  expressao += digito;
  displayResultado.textContent = "";
  atualizarVisor();
}

function iniciarNovaExpressaoSeNecessario() {
  if (displayResultado.textContent) {
    expressao = "";
    displayResultado.textContent = "";
  }
}

function inserirOperador(op) {
  iniciarNovaExpressaoSeNecessario();
  if (op === "mode") return alternarModo();
  const atual = expressao.trim();
  if (!atual && op !== "-") return;
  if (/[+\-*/^]$/.test(atual)) {
    expressao = atual.slice(0, -1) + op;
  } else {
    expressao += op === "exp" ? "E" : op;
  }
  atualizarVisor();
}

function adicionarParentesesAbertura() {
  iniciarNovaExpressaoSeNecessario();
  expressao += "(";
  atualizarVisor();
}

function adicionarParentesesFechamento() {
  iniciarNovaExpressaoSeNecessario();
  const abertos = (expressao.match(/\(/g) || []).length;
  const fechados = (expressao.match(/\)/g) || []).length;
  if (abertos > fechados && /[\d)!pi]$/.test(expressao)) {
    expressao += ")";
    atualizarVisor();
  }
}

function inserirPi() {
  iniciarNovaExpressaoSeNecessario();
  expressao += "pi";
  displayResultado.textContent = "";
  atualizarVisor();
}

function inserirFuncao(nome) {
  iniciarNovaExpressaoSeNecessario();
  if (nome === "!") {
    expressao += "!";
  } else {
    const aliases = { "sin-1": "asin", "cos-1": "acos", "tan-1": "atan" };
    expressao += (aliases[nome] || nome) + "(";
  }
  displayResultado.textContent = "";
  atualizarVisor();
}

function inverterSinal() {
  iniciarNovaExpressaoSeNecessario();
  if (!expressao) {
    expressao = "-";
  } else if (/[+\-*/^(]$/.test(expressao)) {
    expressao += "-";
  } else {
    expressao = "-(" + expressao + ")";
  }
  atualizarVisor();
}

function limparVisor(tipo) {
  if (tipo === "ac" || tipo === "c") {
    expressao = "";
    displayResultado.textContent = "";
    if (tipo === "ac") {
      modoRadianos = true;
      displayModo.textContent = "rad";
    }
    atualizarVisor();
  }
}

function limparCalculadora() {
  limparVisor("ac");
}

function limparOperacao() {
  limparVisor("c");
}

function alternarModo() {
  modoRadianos = !modoRadianos;
  displayModo.textContent = modoRadianos ? "rad" : "deg";
}

function fatorar(n) {
  if (!Number.isInteger(n) || n < 0 || n > 170) throw new Error("Fatorial exige inteiro entre 0 e 170");
  let resultado = 1;
  for (let i = 2; i <= n; i++) resultado *= i;
  return resultado;
}

function tokenizar(texto) {
  const tokens = [];
  const regex = /\s*([0-9]+(?:\.[0-9]*)?(?:e[+-]?[0-9]+)?|\.[0-9]+(?:e[+-]?[0-9]+)?|[A-Za-z]+|[()+\-*/^!,])/gy;
  let pos = 0;
  while (pos < texto.length) {
    regex.lastIndex = pos;
    const match = regex.exec(texto);
    if (!match) throw new Error("Caractere inválido na expressão");
    tokens.push(match[1]);
    pos = regex.lastIndex;
  }
  const expandidos = [];
  const terminaValor = t => t === ")" || t === "!" || t === "pi" || t === "e" || /^[0-9.]/.test(t);
  const iniciaValor = t => t === "(" || t === "pi" || t === "e" || /^[0-9.]/.test(t) || /^[A-Za-z]+$/.test(t);
  for (let i = 0; i < tokens.length; i++) {
    const anterior = tokens[i - 1];
    const atual = tokens[i];
    if (i && terminaValor(anterior) && iniciaValor(atual)) expandidos.push("*");
    expandidos.push(atual);
  }
  return expandidos;
}

function avaliarExpressao(texto) {
  const tokens = tokenizar(texto);
  let indice = 0;
  const atual = () => tokens[indice];
  const consumir = esperado => {
    if (atual() !== esperado) throw new Error("Expressão incompleta ou parênteses incorretos");
    indice++;
  };
  const verificar = valor => {
    if (!Number.isFinite(valor)) throw new Error("Resultado fora do domínio real");
    return valor;
  };
  const primario = () => {
    const t = atual();
    if (t === undefined) throw new Error("Expressão incompleta");
    if (t === "+") { indice++; return unario(); }
    if (t === "-") { indice++; return -unario(); }
    if (t === "(") {
      indice++;
      const valor = soma();
      consumir(")");
      return valor;
    }
    if (/^[0-9.]/.test(t)) {
      indice++;
      const valor = Number(t);
      if (!Number.isFinite(valor)) throw new Error("Número inválido");
      return valor;
    }
    if (t === "pi") { indice++; return Math.PI; }
    if (t === "e") { indice++; return Math.E; }
    if (/^[A-Za-z]+$/.test(t)) {
      indice++;
      consumir("(");
      const x = soma();
      consumir(")");
      const rad = modoRadianos ? x : x * Math.PI / 180;
      let resultado;
      switch (t) {
        case "sin": resultado = Math.sin(rad); break;
        case "cos": resultado = Math.cos(rad); break;
        case "tan": resultado = Math.tan(rad); break;
        case "asin": resultado = modoRadianos ? Math.asin(x) : Math.asin(x) * 180 / Math.PI; break;
        case "acos": resultado = modoRadianos ? Math.acos(x) : Math.acos(x) * 180 / Math.PI; break;
        case "atan": resultado = modoRadianos ? Math.atan(x) : Math.atan(x) * 180 / Math.PI; break;
        case "sqrt": resultado = Math.sqrt(x); break;
        case "log": resultado = Math.log10(x); break;
        case "ln": resultado = Math.log(x); break;
        default: throw new Error("Função desconhecida: " + t);
      }
      return verificar(resultado);
    }
    throw new Error("Valor inesperado: " + t);
  };
  const posfixo = () => {
    let valor = primario();
    while (atual() === "!") {
      indice++;
      valor = fatorar(valor);
    }
    return valor;
  };
  const potencia = () => {
    let base = posfixo();
    if (atual() === "^") {
      indice++;
      base = verificar(Math.pow(base, unario()));
    }
    return base;
  };
  const unario = () => {
    if (atual() === "+") { indice++; return unario(); }
    if (atual() === "-") { indice++; return -unario(); }
    return potencia();
  };
  const produto = () => {
    let valor = unario();
    while (atual() === "*" || atual() === "/" || atual() === "E") {
      const op = atual();
      indice++;
      const proximo = unario();
      if (op === "*") valor *= proximo;
      if (op === "/") {
        if (proximo === 0) throw new Error("Divisão por zero");
        valor /= proximo;
      }
      if (op === "E") valor *= Math.pow(10, proximo);
      valor = verificar(valor);
    }
    return valor;
  };
  const soma = () => {
    let valor = produto();
    while (atual() === "+" || atual() === "-") {
      const op = atual();
      indice++;
      const proximo = produto();
      valor = verificar(op === "+" ? valor + proximo : valor - proximo);
    }
    return valor;
  };
  const resultado = soma();
  if (indice !== tokens.length) throw new Error("Trecho inesperado: " + atual());
  return resultado;
}

function formatarResultado(valor) {
  if (Object.is(valor, -0)) return "0";
  return Number.parseFloat(valor.toPrecision(12)).toString();
}

function calcularResultado() {
  if (!expressao.trim()) return;
  try {
    const resultado = avaliarExpressao(expressao);
    displayResultado.textContent = formatarResultado(resultado);
  } catch (erro) {
    displayResultado.textContent = "Erro";
    console.warn("Expressão inválida:", erro.message);
  }
}

// Os botões principais já chamam estas funções pelo onclick definido no HTML.
document.getElementById("btnToggleColors").addEventListener("click", function () {
  document.body.classList.toggle("daltonismo");
  document.getElementById("visor").classList.toggle("daltonismo");
  ["btnToggleColors", "changeFontBtn", "zoomInBtn", "zoomOutBtn"].forEach(id =>
    document.getElementById(id).classList.toggle("daltonismo")
  );
});
document.getElementById("changeFontBtn").addEventListener("click", () =>
  document.body.classList.toggle("lexend")
);

function zoomIn() {
  if (escala < escalaMaxima) { escala += incrementoEscala; aplicarEscala(); }
}
function zoomOut() {
  if (escala > escalaMinima) { escala -= incrementoEscala; aplicarEscala(); }
}
function aplicarEscala() {
  document.body.style.transform = "scale(" + escala / 100 + ")";
  document.body.style.transformOrigin = "top left";
}

document.addEventListener("keydown", evento => {
  if (/^[0-9]$/.test(evento.key)) inserirDigito(evento.key);
  else if (evento.key === ".") adicionarDigito(".");
  else if ("+-*/^()".includes(evento.key)) {
    expressao += evento.key;
    displayResultado.textContent = "";
    atualizarVisor();
  } else if (evento.key === "Enter" || evento.key === "=") calcularResultado();
  else if (evento.key === "Backspace") {
    expressao = expressao.slice(0, -1);
    atualizarVisor();
  } else if (evento.key === "Escape") limparVisor("ac");
});

atualizarVisor();
