export class ChemicalReactions {
  static reactions = [
    {
      reactants: ['water', 'salt'],
      products: ['saltwater'],
      chance: 1.0
    },
    {
      reactants: ['acid', 'metal'],
      products: ['hydrogen', 'metaloxide'],
      chance: 0.8
    },
    {
      reactants: ['water', 'fire'],
      products: ['steam'],
      chance: 0.9
    },
    {
      reactants: ['gunpowder', 'fire'],
      products: ['explosion'],
      chance: 1.0
    }
  ];

  static checkReaction(particle1, particle2) {
    if (!particle1 || !particle2) return null;

    const types = [particle1.constructor.name, particle2.constructor.name].sort();
    
    for (const reaction of this.reactions) {
      const reactants = reaction.reactants.sort();
      if (types[0] === reactants[0] && types[1] === reactants[1]) {
        if (Math.random() < reaction.chance) {
          return reaction.products;
        }
      }
    }
    
    return null;
  }
} 