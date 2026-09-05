/**
 * La Cámara de Ecos - Rompecabezas Mágico de Predicción de Secuencias de Números
 * 
 * En una cámara mística en las profundidades de las Montañas de Numerica, secuencias
 * de números resuenan infinitamente. Tu tarea es predecir el próximo eco descubriendo
 * el patrón que une cada secuencia mágica.
 * 
 * Esta aplicación detecta progresiones aritméticas y predice el próximo número
 * en cualquier secuencia mágica.
 */

/**
 * Valida que una secuencia sea una progresión aritmética válida
 * 
 * @param {number[]} sequence - La secuencia a validar
 * @returns {object} - { isValid: boolean, difference: number, error: string|null }
 */
function validateArithmeticProgression(sequence) {
  // Verifica si la secuencia es un array
  if (!Array.isArray(sequence)) {
    return { isValid: false, difference: null, error: "La secuencia debe ser un array" };
  }

  // Verifica la longitud mínima
  if (sequence.length < 2) {
    return { isValid: false, difference: null, error: "La secuencia debe tener al menos 2 números" };
  }

  // Verifica si todos los elementos son números
  if (!sequence.every(num => typeof num === 'number' && !isNaN(num))) {
    return { isValid: false, difference: null, error: "Todos los elementos deben ser números válidos" };
  }

  // Calcula la diferencia entre los primeros dos números
  const firstDifference = sequence[1] - sequence[0];

  // Verifica si todas las diferencias consecutivas son iguales
  for (let i = 2; i < sequence.length; i++) {
    const currentDifference = sequence[i] - sequence[i - 1];
    if (currentDifference !== firstDifference) {
      return {
        isValid: false,
        difference: null,
        error: `No es una progresión aritmética. La diferencia entre la posición ${i - 1} y ${i} es ${currentDifference}, se esperaba ${firstDifference}`
      };
    }
  }

  return { isValid: true, difference: firstDifference, error: null };
}

/**
 * Predice el próximo número en una progresión aritmética
 * 
 * @param {number[]} sequence - La secuencia de la que predecir
 * @returns {object} - { success: boolean, nextNumber: number|null, message: string }
 */
function predictNextNumber(sequence) {
  const validation = validateArithmeticProgression(sequence);

  if (!validation.isValid) {
    return { success: false, nextNumber: null, message: validation.error };
  }

  // El próximo número es el último número más la diferencia común
  const nextNumber = sequence[sequence.length - 1] + validation.difference;
  return { success: true, nextNumber, message: `El próximo eco en la cámara es: ${nextNumber}` };
}

/**
 * Clase Cámara de Ecos - Gestiona la sala de ecos mágica y los recuerdos de predicciones
 */
class EchoChamber {
  constructor() {
    this.memories = []; // Store all previous echo predictions
  }

  /**
   * Agrega un nuevo recuerdo de una predicción a la cámara
   * 
   * @param {number[]} sequence - La secuencia que fue procesada
   * @param {number} prediction - El siguiente número predicho
   */
  recordMemory(sequence, prediction) {
    this.memories.push({
      timestamp: new Date().toISOString(),
      sequence: [...sequence],
      prediction,
      memoryIndex: this.memories.length + 1
    });
  }

  /**
   * Recupera todos los recuerdos almacenados en la cámara
   * 
   * @returns {array} - Todos los recuerdos almacenados
   */
  getAllMemories() {
    return this.memories;
  }

  /**
   * Muestra todos los recuerdos de forma formateada
   */
  displayMemories() {
    if (this.memories.length === 0) {
      console.log("\n🔮 La Cámara de Ecos está vacía. Sin recuerdos aún.\n");
      return;
    }

    console.log("\n📚 ===== RECUERDOS DE LA CÁMARA DE ECOS =====");
    this.memories.forEach((memory) => {
      console.log(`\n Recuerdo ${memory.memoryIndex}:`);
      console.log(`  Secuencia: [${memory.sequence.join(", ")}]`);
      console.log(`  Próximo Eco: ${memory.prediction}`);
    });
    console.log("\n===========================================\n");
  }

  /**
   * Borra todos los recuerdos de la cámara
   */
  clearMemories() {
    this.memories = [];
    console.log("🗑️  La Cámara de Ecos ha sido limpiada de todos los recuerdos.\n");
  }
}

/**
 * Muestra el mensaje de bienvenida e historia
 */
function displayWelcome() {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║   🌟 BIENVENIDO A LA CÁMARA DE ECOS DE NUMERICA 🌟         ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");
  console.log("En las Montañas Místicas de Numerica, existe una cámara mágica");
  console.log("donde los números resuenan en patrones perfectos. Tu misión es");
  console.log("descubrir el patrón y predecir el próximo eco...\n");
  console.log("Comandos:");
  console.log("  • test    : Prueba con la secuencia predeterminada [3, 6, 9, 12]");
  console.log("  • custom  : Ingresa tu propia secuencia");
  console.log("  • samples : Ejecuta todos los casos de prueba de muestra");
  console.log("  • memory  : Ver todos los recuerdos en la cámara");
  console.log("  • clear   : Borrar todos los recuerdos");
  console.log("  • exit    : Salir de la Cámara de Ecos\n");
}

/**
 * Ejecutor principal de la aplicación con interfaz interactiva
 */
async function main() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Create the echo chamber
  const chamber = new EchoChamber();

  // Secuencias de prueba de muestra
  const sampleSequences = [
    { sequence: [3, 6, 9, 12], description: "Múltiplos de 3" },
    { sequence: [2, 4, 6, 8, 10], description: "Números pares" },
    { sequence: [1, 4, 7, 10], description: "Suma 3 cada vez" },
    { sequence: [10, 7, 4, 1, -2], description: "Resta 3 cada vez" },
    { sequence: [100, 90, 80, 70], description: "Resta 10 cada vez" }
  ];

  function askCommand() {
    rl.question("🔮 Ingresa comando: ", (command) => {
      const cmd = command.toLowerCase().trim();

      switch (cmd) {
        case 'test':
          console.log("\n✨ Probando la secuencia predeterminada: [3, 6, 9, 12]");
          const defaultSeq = [3, 6, 9, 12];
          const result = predictNextNumber(defaultSeq);
          console.log(`   Resultado: ${result.message}`);
          chamber.recordMemory(defaultSeq, result.nextNumber);
          console.log();
          askCommand();
          break;

        case 'custom':
          rl.question('📝 Ingresa tu secuencia (números separados por comas): ', (input) => {
            try {
              const sequence = input.split(',').map(num => parseFloat(num.trim()));
              const result = predictNextNumber(sequence);
              
              if (result.success) {
                console.log(`\n✅ ${result.message}`);
                chamber.recordMemory(sequence, result.nextNumber);
              } else {
                console.log(`\n❌ Error: ${result.message}`);
              }
              console.log();
              askCommand();
            } catch (error) {
              console.log(`\n❌ Entrada inválida. Por favor ingresa números separados por comas.\n`);
              askCommand();
            }
          });
          break;

        case 'samples':
          console.log("\n🎯 Running all sample test cases...\n");
          sampleSequences.forEach((sample, index) => {
            const result = predictNextNumber(sample.sequence);
            console.log(`Test ${index + 1}: ${sample.description}`);
            console.log(`  Input:  [${sample.sequence.join(', ')}]`);
            if (result.success) {
              console.log(`  Output: ${result.nextNumber}`);
              chamber.recordMemory(sample.sequence, result.nextNumber);
            } else {
              console.log(`  Error:  ${result.message}`);
            }
            console.log();
          });
          askCommand();
          break;

        case 'memory':
          chamber.displayMemories();
          askCommand();
          break;

        case 'clear':
          chamber.clearMemories();
          askCommand();
          break;

        case 'exit':
          console.log("\n✨ The Echo Chamber fades as you leave... Farewell, seeker! ✨\n");
          rl.close();
          break;

        default:
          console.log("❌ Unknown command. Please try again.\n");
          askCommand();
      }
    });
  }

  displayWelcome();
  askCommand();
}

// Exporta funciones para uso como módulo
module.exports = {
  validateArithmeticProgression,
  predictNextNumber,
  EchoChamber
};

// Solo ejecutar la interfaz de consola si se ejecuta directamente
if (require.main === module) {
  main().catch(console.error);
}
