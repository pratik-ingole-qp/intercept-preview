import { useNavigate } from 'react-router-dom';
import { RECIPE_MATCH_LABEL } from '../data';
import type { Recipe } from '../data';
import { slugify } from '../slug';

/**
 * The "how" layer. A rule name on its own is a pointer; a rule name with the
 * operand and the literal value is an instruction. This renders the second.
 */
export default function RecipeBlock({ recipe, dense = false }: { recipe: Recipe; dense?: boolean }) {
  const navigate = useNavigate();

  return (
    <div className={`recipe${dense ? ' recipe-dense' : ''}`}>
      <div className="recipe-head">
        <span className="recipe-step-num">1</span>
        <div>
          <h5>Create the intercept</h5>
          <p>
            Create Intercept →{' '}
            <button className="inline-link" type="button" onClick={() => navigate(`/preview/${recipe.type}`)}>
              {recipe.typeLabel} →
            </button>
          </p>
        </div>
      </div>

      <div className="recipe-head">
        <span className="recipe-step-num">2</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h5>Add the trigger rules</h5>
          <p className="recipe-match">{RECIPE_MATCH_LABEL[recipe.match]}</p>

          {recipe.rows.length > 0 && (
            <div className="recipe-rows">
              {recipe.rows.map((row, i) => (
                <div className="recipe-row" key={`${row.rule}-${i}`}>
                  {i > 0 && <span className="recipe-and">AND</span>}
                  <div className="recipe-fields">
                    <span className="illus-chip illus-chip-if">IF</span>
                    <button
                      className="illus-chip recipe-chip-rule"
                      type="button"
                      onClick={() => navigate(`/rules/${slugify(row.rule)}`)}
                      title={`Open the ${row.rule} reference`}
                    >
                      {row.rule}
                    </button>
                    {row.field && <span className="illus-chip recipe-chip-field">{row.field}</span>}
                    <span className="illus-chip illus-chip-op">{row.operand}</span>
                    <span className="illus-chip illus-chip-val">{row.value}</span>
                  </div>
                  <p className="recipe-note">{row.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="recipe-head">
        <span className="recipe-step-num">3</span>
        <div>
          <h5>Save, then verify</h5>
          <p>{recipe.verify}</p>
        </div>
      </div>
    </div>
  );
}
