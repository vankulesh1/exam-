enum HeroType {
  Warrior = "WARRIOR",
  Mage = "MAGE",
  Archer = "ARCHER",
}

enum AttackType {
  Physical = "PHYSICAL",
  Magical = "MAGICAL",
  Ranged = "RANGED",
}

interface HeroStats {
  health: number;
  attack: number;
  defense: number;
  speed: number;
}

interface Hero {
  id: number;
  name: string;
  type: HeroType;
  attackType: AttackType;
  stats: HeroStats;
  isAlive: boolean;
}

type AttackResult = {
  damage: number;
  isCritical: boolean;
  remainingHealth: number;
};

let heroIdCounter = 1;

function createHero(name: string, type: HeroType): Hero {
  let stats: HeroStats;

  switch (type) {
    case HeroType.Warrior:
      stats = { health: 120, attack: 15, defense: 10, speed: 8 };
      break;
    case HeroType.Mage:
      stats = { health: 80, attack: 25, defense: 5, speed: 10 };
      break;
    case HeroType.Archer:
      stats = { health: 100, attack: 18, defense: 7, speed: 12 };
      break;
    default:
      throw new Error("Unknown hero type");
  }

  return {
    id: heroIdCounter++,
    name,
    type,
    attackType: getAttackTypeByHeroType(type),
    stats,
    isAlive: true,
  };
}

function getAttackTypeByHeroType(type: HeroType): AttackType {
  switch (type) {
    case HeroType.Warrior:
      return AttackType.Physical;
    case HeroType.Mage:
      return AttackType.Magical;
    case HeroType.Archer:
      return AttackType.Ranged;
  }
}

function calculateDamage(attacker: Hero, defender: Hero): AttackResult {
  const baseDamage = attacker.stats.attack - defender.stats.defense;
  const damage = Math.max(baseDamage, 5);

  const isCritical = Math.random() < 0.2;
  const totalDamage = isCritical ? damage * 2 : damage;

  defender.stats.health -= totalDamage;

  if (defender.stats.health <= 0) {
    defender.stats.health = 0;
    defender.isAlive = false;
  }

  return {
    damage: totalDamage,
    isCritical,
    remainingHealth: defender.stats.health,
  };
}

function findHeroByProperty<T extends keyof Hero>(
  heroes: Hero[],
  property: T,
  value: Hero[T]
): Hero | undefined {
  return heroes.find((hero) => hero[property] === value);
}

function battleRound(hero1: Hero, hero2: Hero): string {
  if (!hero1.isAlive || !hero2.isAlive) {
    return `${hero1.name} або ${hero2.name} вже мертві. Бій неможливий.`;
  }

  const attacker = hero1.stats.speed >= hero2.stats.speed ? hero1 : hero2;
  const defender = attacker === hero1 ? hero2 : hero1;

  const attackResult = calculateDamage(attacker, defender);

  let result = `${attacker.name} атакує ${defender.name} і завдає ${attackResult.damage} пошкоджень`;
  if (attackResult.isCritical) {
    result += " (Критичний удар!)";
  }
  result += `. У ${defender.name} залишилось ${attackResult.remainingHealth} здоров'я.`;

  if (!defender.isAlive) {
    result += ` ${defender.name} загинув!`;
  }

  return result;
}

const heroes: Hero[] = [
  createHero("Дмитро", HeroType.Warrior),
  createHero("Мерлін", HeroType.Mage),
  createHero("Леонардо", HeroType.Archer),
];

console.log("Створені герої:", heroes);

const foundHero = findHeroByProperty(heroes, "type", HeroType.Warrior);
console.log("Знайдений герой:", foundHero);

const battle1 = battleRound(heroes[0], heroes[1]);
console.log(battle1);

const battle2 = battleRound(heroes[1], heroes[2]);
console.log(battle2);

const battle3 = battleRound(heroes[0], heroes[2]);
console.log(battle3);

console.log("Фінальний статус героїв:", heroes);
