import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { ListComponent } from './ListComponent';

describe('ListComponent', () => {
  it('renders options and calls filter on change', async () => {
    const options = [
      { id: 1, option: 'Alpha', value: 'alpha' },
      { id: 2, option: 'Beta', value: 'beta' },
    ];

    const onFilter = vi.fn();

    const { container } = render(
      <ListComponent
        title="City"
        description="Choose city"
        filter={onFilter}
        options={options}
        isReset={false}
      />,
    );

    // Check that options are rendered
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.options.length).toBe(3); // 1 placeholder + 2 options

    // change selection
    await userEvent.selectOptions(select, 'beta');

    expect(onFilter).toHaveBeenCalledWith('beta');
  });
});
