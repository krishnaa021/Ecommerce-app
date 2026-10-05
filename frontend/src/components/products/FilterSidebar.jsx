import { PRICE_RANGES, RATING_OPTIONS } from '../../utils/productFilters'

function Group({ title, children }) {
  return (
    <div className="border-b border-gray-200 py-4">
      <h3 className="mb-3 text-sm font-bold uppercase text-gray-800">{title}</h3>
      {children}
    </div>
  )
}

function Option({ checked, onChange, label, count }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-gray-700 hover:text-gray-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-brand"
      />
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-xs text-gray-400">({count})</span>}
    </label>
  )
}

export default function FilterSidebar({
  subCategoryFacets,
  brandFacets,
  selected, 
  onToggle, 
  onSet, 
  onClear,
  hasActive,
}) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="text-sm font-bold uppercase text-gray-800">Filters</h2>
        {hasActive && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold uppercase text-brand hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {subCategoryFacets.length > 1 && (
        <Group title="Categories">
          {subCategoryFacets.map(({ value, count }) => (
            <Option
              key={value}
              label={value}
              count={count}
              checked={selected.subCategories.includes(value.toLowerCase())}
              onChange={() => onToggle('subCategory', value)}
            />
          ))}
        </Group>
      )}

      {brandFacets.length > 1 && (
        <Group title="Brand">
          <div className="max-h-56 overflow-y-auto pr-1">
            {brandFacets.map(({ value, count }) => (
              <Option
                key={value}
                label={value}
                count={count}
                checked={selected.brands.includes(value)}
                onChange={() => onToggle('brand', value)}
              />
            ))}
          </div>
        </Group>
      )}

      <Group title="Price">
        {PRICE_RANGES.map((r) => {
          const checked = selected.price === r.value
          return (
            <Option
              key={r.value}
              label={r.label}
              checked={checked}
              onChange={() => onSet('price', checked ? '' : r.value)}
            />
          )
        })}
      </Group>

      <Group title="Customer rating">
        {RATING_OPTIONS.map((r) => {
          const checked = selected.rating === r
          return (
            <Option
              key={r}
              label={`${r}★ & above`}
              checked={checked}
              onChange={() => onSet('rating', checked ? '' : String(r))}
            />
          )
        })}
      </Group>
    </div>
  )
}