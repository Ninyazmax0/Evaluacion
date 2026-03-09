/**
 * Sistema de Desafíos Diarios
 * "El tiempo es relativo, pero los deadlines son absolutos."
 */

const DAILY_CHALLENGES_DB = [
    // Nivel Básico (1-5)
    {
        id: 'py_easy_1',
        minLevel: 0,
        maxLevel: 5,
        title: 'El Eco',
        description: 'Crea una función llamada `eco` que reciba un texto y lo devuelva repetido 3 veces.',
        template: 'def eco(texto):\n    # Tu código aquí\n    pass',
        testCode: `
try:
    assert eco("Hola") == "HolaHolaHola"
    assert eco("A") == "AAA"
    print("SUCCESS")
except Exception as e:
    print(f"FAIL: {e}")
`
    },
    {
        id: 'py_easy_2',
        minLevel: 0,
        maxLevel: 5,
        title: 'Suma Par',
        description: 'Crea una función `es_par(n)` que devuelva True si n es par, False si no.',
        template: 'def es_par(n):\n    return ',
        testCode: `
try:
    assert es_par(4) == True
    assert es_par(7) == False
    print("SUCCESS")
except:
    print("FAIL")
`
    },
    
    // Nivel Intermedio (6-15)
    {
        id: 'py_mid_1',
        minLevel: 6,
        maxLevel: 15,
        title: 'Filtro de Amigos',
        description: 'Dada una lista de nombres, devuelve solo los que tienen más de 5 letras.',
        template: 'def filtrar_nombres(lista):\n    # Tu código aquí\n    pass',
        testCode: `
try:
    res = filtrar_nombres(["Ana", "Alejandro", "Bob", "Roberto"])
    assert "Alejandro" in res
    assert "Roberto" in res
    assert "Ana" not in res
    print("SUCCESS")
except:
    print("FAIL")
`
    }
];

class DailyChallengeSystem {
    
    // Genera una semilla basada en el día (YYYYMMDD)
    getDailySeed() {
        const now = new Date();
        // Ajustamos zona horaria si quieres que sea global
        return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    }

    // Selecciona el desafío para el usuario hoy
    getChallengeForUser(userLevel = 1) {
        const seed = this.getDailySeed();
        
        // Filtramos por nivel del usuario
        const suitableChallenges = DAILY_CHALLENGES_DB.filter(c => 
            userLevel >= c.minLevel && userLevel <= c.maxLevel
        );

        if (suitableChallenges.length === 0) return DAILY_CHALLENGES_DB[0]; // Fallback

        // Usamos la semilla para elegir siempre el mismo index hoy para este nivel
        // seed % length nos da un número entre 0 y length-1
        const index = seed % suitableChallenges.length;
        
        return suitableChallenges[index];
    }

    // Verifica si el usuario ya completó el desafío de hoy
    hasCompletedDaily(user) {
        const seed = this.getDailySeed();
        return user.lastDailyChallenge === seed;
    }

    // Marca como completado
    markCompleted(user) {
        user.lastDailyChallenge = this.getDailySeed();
        user.streak = (user.streak || 0) + 1;
        user.monedas = (user.monedas || 0) + 100; // Premio
        return user;
    }
}

// Exportar instancia global
window.dailyChallengeSystem = new DailyChallengeSystem();
