// Variável de controle para verificar se uma operação foi realizada
let operacaoRealizada = false;
// Variáveis para rastrear a operação e os números
let operador = "";
let numeroAnterior = "";
let novoNumero = "";
let calculando = false;
let modoRadianos = true;
let parentesesAbertos = 0;
// Variável para armazenar a expressão dentro dos parênteses
let expressaoDentroDosParenteses = "";
// Função para atualizar o visor
function atualizarVisor() {
  const visor = document.getElementById("visor");
  let visorConteudo = "";
  if (numeroAnterior !== "") {
    visorConteudo += numeroAnterior;
  }
  if (operador !== "") {
    visorConteudo += " " + operador + " ";
  }
  visorConteudo += novoNumero;
  // Adicione os parênteses de abertura e fechamento ao conteúdo do visor
  if (parentesesAbertos > 0) {
    visorConteudo += " (".repeat(parentesesAbertos);
  }
  visor.textContent = visorConteudo;
}
// Função para adicionar parênteses de abertura
function adicionarParentesesAbertura() {
  if (calculando) {
    numeroAnterior = "";
    calculando = false;
  }
  if (numeroAnterior !== "") {
    novoNumero += operador; // Adicione o operador antes do parêntese de abertura
    operador = "";
  }
  novoNumero += "(";
  parentesesAbertos++;
  atualizarVisor();
}
function avaliarExpressao(expressao) {
  try {
    // Substitua "^" por "**" para representar a potenciação
    expressao = expressao.replace(/\^/g, '**');
    // Avalie a expressão usando a função eval
    const resultado = eval(expressao);
    // Se o resultado for NaN, é um erro
    if (isNaN(resultado)) {
      console.error("Erro na expressão: " + expressao);
      return NaN;
    }
    // Use toFixed para limitar o número de casas decimais apropriado
    return parseFloat(resultado.toFixed(10));
  } catch (error) {
    console.error("Erro na expressão: " + error);
    return NaN;
  }
}
function adicionarParentesesFechamento() {
  if (parentesesAbertos > 0 && !calculando) {
    novoNumero += ")";
    parentesesAbertos--;
    atualizarVisor();
  }
}
// Função para avaliar a expressão dentro dos parênteses
function avaliarExpressaoDentroDosParenteses() {
  try {
    const resultado = eval(expressaoDentroDosParenteses);
    return resultado;
  } catch (error) {
    console.error("Erro na expressão dentro dos parênteses: " + error);
    return NaN;
  }
}
function limparCalculadora() {
  numeroAnterior = "";
  operador = "";
  novoNumero = "";
  calculando = false;
  atualizarVisor();
  operacaoRealizada = false; // Adicionado para reiniciar a operação
  document.getElementById('mode').textContent = 'rad';
}
function limparOperacao() {
  numeroAnterior = "";
  operador = "";
  novoNumero = "";
  calculando = false;
  atualizarVisor();
}
// Função para inserir o valor de π (pi) no visor
function inserirPi() {
  if (calculando) {
    numeroAnterior = "";
    calculando = false;
  }
  novoNumero += Math.PI; // Utilizamos a constante Math.PI para representar π
  atualizarVisor();
}
// Função para adicionar um ponto decimal
function adicionarPontoDecimal() {
  if (calculando) {
    novoNumero = "0.";
    calculando = false;
  } else if (!novoNumero.includes(".")) {
    novoNumero += ".";
  }
  atualizarVisor();
}
// Função para realizar cálculos
function calcular() {
  let resultado;
  const num1 = parseFloat(numeroAnterior);
  const num2 = parseFloat(novoNumero);
  switch (operador) {
    case "+":
      resultado = num1 + num2;
      break;
    case "-":
      resultado = num1 - num2;
      break;
    case "*":
      resultado = num1 * num2;
      break;
    case "/":
      resultado = num1 / num2;
      break;
    case "^":
      resultado = Math.pow(num1,num2);
      break;
    case "e":
      resultado = num1*(Math.pow(10,num2));
      break;
  }

  // Use toFixed para limitar o número de casas decimais apropriado
  numeroAnterior = parseFloat(resultado.toFixed(10));
  operador = "";
  novoNumero = "";
  calculando = true;
  atualizarVisor();
  atualizarResultado(numeroAnterior);
}
// Função para lidar com os números
function adicionarNumero(numero) {
  if (operacaoRealizada) {
    // Se uma operação foi realizada, limpar os valores anteriores
    numeroAnterior = "";
    operador = "";
    novoNumero = "";
    calculando = false;
    atualizarResultado();
    operacaoRealizada = false;
  }
  if (calculando) {
    novoNumero = numero.toString();
    calculando = false;
  } else {
    // Certifique-se de que o ponto decimal seja adicionado apenas uma vez
    if (numero === "." && novoNumero.includes(".")) {
      return;
    }
    if (novoNumero.endsWith("(")) {
      // Se o último caractere for um parêntese de abertura, adicione um operador antes do número
      operador = numero;
    } else {
      novoNumero += numero.toString();
    }
  }
  atualizarVisor();
}
// Função para limpar o visor
function limparVisor(tipo) {
  if (tipo === 'ac') {
    numeroAnterior = "";
    operador = "";
    novoNumero = "";
    calculando = false;
    modoRadianos = true; // Isso restaurará o modo para "rad" ao limpar a calculadora
    document.getElementById('mode').textContent = 'rad';
  } else if (tipo === 'c') {
    novoNumero = "";
  }
  atualizarVisor();
}
// Função para inverter o sinal do número
function inverterSinal() {
  if (novoNumero !== "") {
    novoNumero = (-parseFloat(novoNumero)).toString();
    atualizarVisor();
  } else if (numeroAnterior !== "" && operador !== "") {
    operador = operador === "+" ? "-" : "+";
    atualizarVisor();
  }

}
// Função para inserir funções trigonométricas e alternar entre "rad" e "deg"
function inserirFuncao(funcao) {
  if (funcao === 'sin') {
    if (modoRadianos) {
      // Em modo radianos, calcular o seno
      const resultado = Math.sin(parseFloat(novoNumero));
      if (resultado === 1.2246467991473532e-16) {
        novoNumero = '0';
      } else {
        novoNumero = resultado.toString();
      }
    } else {
      // Em modo graus, converter graus para radianos e calcular o seno
      const graus = parseFloat(novoNumero);
      const radianos = (graus * Math.PI) / 180;
      const resultado = Math.sin(radianos);
      if (resultado === 1.2246467991473532e-16) {
        novoNumero = '0';
      } else {
        novoNumero = resultado.toString();
      }
    }
  }
  else if (funcao === 'sin-1') {
    if (modoRadianos) {
      // Em modo radianos, calcular o seno
      const resultado = Math.asin(parseFloat(novoNumero));
      if (resultado === 1.2246467991473532e-16) {
        novoNumero = '0';
      } else {
        novoNumero = resultado.toString();
      }
    } else {
      // Em modo graus, converter graus para radianos e calcular o seno
      const graus = parseFloat(novoNumero);
      const radianos = (graus * Math.PI) / 180;
      const resultado = Math.asin(radianos);
      if (resultado === 1.2246467991473532e-16) {
        novoNumero = '0';
      } else {
        novoNumero = resultado.toString();
      }
    }
  }
  else if (funcao === 'cos') {
    if (modoRadianos) {
      // Em modo radianos, calcular o seno
      const resultado = Math.cos(parseFloat(novoNumero));
      if (resultado === 1.2246467991473532e-16) {
        novoNumero = '0';
      } else {
        novoNumero = resultado.toString();
      }
    } else {
      // Em modo graus, converter graus para radianos e calcular o seno
      const graus = parseFloat(novoNumero);
      const radianos = (graus * Math.PI) / 180;
      const resultado = Math.cos(radianos);
      if (resultado === 1.2246467991473532e-16) {
        novoNumero = '0';
      } else {
        novoNumero = resultado.toString();
      }
    }
  }
  else if (funcao === 'cos-1') {
    if (modoRadianos) {
      // Em modo radianos, calcular o seno
      const resultado = Math.acos(parseFloat(novoNumero));
      if (resultado === 1.2246467991473532e-16) {
        novoNumero = '0';
      } else {
        novoNumero = resultado.toString();
      }
    } else {
      // Em modo graus, converter graus para radianos e calcular o seno
      const graus = parseFloat(novoNumero);
      const radianos = (graus * Math.PI) / 180;
      const resultado = Math.acos(radianos);
      if (resultado === 1.2246467991473532e-16) {
        novoNumero = '0';
      } else {
        novoNumero = resultado.toString();
      }
    }
  }
  else if (funcao === 'tan') {
    if (modoRadianos) {
      // Em modo radianos, calcular o seno
      const resultado = Math.tan(parseFloat(novoNumero));
      if (resultado === 1.2246467991473532e-16) {
        novoNumero = '0';
      } else {
        novoNumero = resultado.toString();
      }
    } else {
      // Em modo graus, converter graus para radianos e calcular o seno
      const graus = parseFloat(novoNumero);
      const radianos = (graus * Math.PI) / 180;
      const resultado = Math.tan(radianos);
      if (resultado === 1.2246467991473532e-16) {
        novoNumero = '0';
      } else {
        novoNumero = resultado.toString();
      }
    }
  }
  else if (funcao === 'tan-1') {
    if (modoRadianos) {
      // Em modo radianos, calcular o seno
      const resultado = Math.atan(parseFloat(novoNumero));
      if (resultado === 1.2246467991473532e-16) {
        novoNumero = '0';
      } else {
        novoNumero = resultado.toString();
      }
    } else {
      // Em modo graus, converter graus para radianos e calcular o seno
      const graus = parseFloat(novoNumero);
      const radianos = (graus * Math.PI) / 180;
      const resultado = Math.atan(radianos);
      if (resultado === 1.2246467991473532e-16) {
        novoNumero = '0';
      } else {
        novoNumero = resultado.toString();
      }
    }
  }
  else if (funcao === 'log') {
    // Verifica se o novo número é maior que 0, pois o logaritmo de 0 ou número negativo não está definido.
    if (parseFloat(novoNumero) > 0) {
      // Calcula o logaritmo natural (base e) do novo número.
      novoNumero = Math.log10(parseFloat(novoNumero));
    } else {
      // Caso o número seja 0 ou negativo, exibe uma mensagem de erro ou faz o tratamento desejado.
      novoNumero = 'Erro'; // Você pode personalizar essa mensagem de erro.
    }
  }
  else if (funcao === 'ln') {
    // Verifica se o novo número é maior que 0, pois o logaritmo de 0 ou número negativo não está definido.
    if (parseFloat(novoNumero) > 0) {
      // Calcula o logaritmo natural (base e) do novo número.
      novoNumero = Math.log10(parseFloat(novoNumero))*2.3;
    } else {
      // Caso o número seja 0 ou negativo, exibe uma mensagem de erro ou faz o tratamento desejado.
      novoNumero = 'Erro'; // Você pode personalizar essa mensagem de erro.
    }
  }
  else if (funcao === 'sqrt') {
    // Verifica se o novo número é maior que 0, pois o logaritmo de 0 ou número negativo não está definido.
    if (parseFloat(novoNumero) >= 0) {
      // Calcula o logaritmo natural (base e) do novo número.
      novoNumero = Math.sqrt(parseFloat(novoNumero));
    } else {
      // Caso o número seja 0 ou negativo, exibe uma mensagem de erro ou faz o tratamento desejado.
      novoNumero = 'Erro'; // Você pode personalizar essa mensagem de erro.
    }
  }
  else if (funcao === '!') {
    // Verifica se o número é um número inteiro não negativo.
    if (Number.isInteger(parseFloat(novoNumero)) && parseFloat(novoNumero) >= 0) {
      novoNumero = calcularFatorial(parseFloat(novoNumero));
    } else {
      novoNumero = 'Erro'; // Número inválido para o fatorial.
    }
  }
  atualizarVisor();
}
function calcularFatorial(numero) {
  if (numero === 0) {
    return 1;
  }
  let resultado = 1;
  for (let i = 1; i <= numero; i++) {
    resultado *= i;
  }
  return resultado;
}
// Função para alternar entre "rad" e "deg" no visor
function alternarModo() {
  modoRadianos = !modoRadianos;
  const modoElement = document.getElementById('mode');
  modoElement.textContent = modoRadianos ? 'rad' : 'deg';
}
// Event listener para o botão de igual
document.getElementById("igual").addEventListener("click", () => {
  if (operador === "e") {
    calcularExp();
  } else {
    calcularResultado();
  }
});
document.getElementById("igual").addEventListener("click", () => {
  if (parentesesAbertos === 0) {
    calcularResultado();
  } else {
    console.log("Erro: Parênteses não estão balanceados.");
  }
});
// Adicione a alternância de "rad" e "deg" ao botão "mode"
document.getElementById('modo').addEventListener('click', alternarModo);
// Event listeners para os botões de números
document.querySelectorAll(".numero").forEach((button) => {
  button.addEventListener("click", () => {
    adicionarNumero(button.textContent);
  });
})
// Event listeners para os botões de operadores
document.querySelectorAll(".operador").forEach((button) => {
  button.addEventListener("click", () => {
    if (numeroAnterior !== "" && !calculando) {
      calcular();
    }
    operador = button.textContent;
    numeroAnterior = novoNumero;
    calculando = true;
    atualizarVisor();
  });
})
// Event listener para o botão de limpar
document.getElementById("limpar").addEventListener("click", () => {
  limparCalculadora();
});
// Event listener para o botão de ponto decimal
document.getElementById("ponto").addEventListener("click", () => {
  adicionarPontoDecimal();
});
// Event listener para o botão de potenciação
document.getElementById("potenciacao").addEventListener("click", () => {
  if (numeroAnterior !== "" && !calculando) {
    calcular();
  }
  operador = "^";
  numeroAnterior = novoNumero; // Mostra o primeiro número e "^" no visor
  novoNumero = "";
  calculando = false;
  atualizarVisor();
});
// Event listener para o botão "exp"
document.getElementById("botaoExp").addEventListener("click", () => {
  if (numeroAnterior !== "" && !calculando) {
    calcular();
  }
  operador = "e";
  numeroAnterior = novoNumero; // Mostra o primeiro número e "^" no visor
  novoNumero = "";
  calculando = false;
  atualizarVisor();
});
// Função para calcular o resultado quando o botão "=" é pressionado
function calcularResultado() {
  if (parentesesAbertos === 0) {
    if (numeroAnterior !== "" && operador !== "" && novoNumero !== "") {
      calcular();
      operador = "";
      novoNumero = "";
      calculando = true;
      atualizarVisor();
      atualizarResultado(numeroAnterior);
      numeroAnterior = "";
    }
  } else {
    console.log("Erro: Parênteses não estão balanceados.");
  }
}
//script para o modo daltonismo
document.getElementById("btnToggleColors").addEventListener("click",function() {
  document.body.classList.toggle("daltonismo");
  document.getElementById("visor").classList.toggle("daltonismo");
  document.getElementById("btnToggleColors").classList.toggle("daltonismo");
  document.getElementById("changeFontBtn").classList.toggle("daltonismo");
  document.getElementById("zoomInBtn").classList.toggle("daltonismo");
  document.getElementById("zoomOutBtn").classList.toggle("daltonismo");
})
//script para quem é dixleco
document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('changeFontBtn');
  button.addEventListener('click', function () {
    document.body.classList.toggle('lexend');
  });
});
//script para míope
let escala = 100; // Inicialmente, a escala é 100%.
const incrementoEscala = 10; // O aumento ou diminuição percentual.
const escalaMinima = 100; // A escala mínima permitida.
const escalaMaxima = 200; // A escala máxima permitida.
function zoomIn() {
  if (escala < escalaMaxima) {
    escala += incrementoEscala;
    aplicarEscala();
  }
}
function zoomOut() {
  if (escala > escalaMinima) {
    escala -= incrementoEscala;
    aplicarEscala();
  }
}
function aplicarEscala() {
  document.body.style.transform = `scale(${escala / 100})`;
}
document.addEventListener('DOMContentLoaded', function () {
  aplicarEscala();
});