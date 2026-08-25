import { describe, expect, it } from 'vitest';
import { estimateVariance, toCreatePayload, toEditableMaterials } from './editor';

describe('Material Request editor', () => {
  it('maps create and edit through the same profile-id keyed shape', () => {
    const materials = toEditableMaterials({
      profile1: { equipment_machinery_name: 'Pump', consumable_supplies: { oil: { name: 'oil', unit: 'l', quantity: 3 } } },
    });
    expect(toCreatePayload('maintenance1', 'Cơ khí', 'repair', materials).materials_for_equipment).toEqual(materials);
  });

  it('allows quantities over estimate and reports variance', () => {
    expect(estimateVariance(12, { name: 'oil', unit: 'l', quantity: 10 })).toBe(2);
  });
});
