import type { HipaaStandard } from '../data/hipaa';
import SpecItem from './SpecItem';

interface Props {
  standard: HipaaStandard;
}

export default function StandardBlock({ standard }: Props) {
  return (
    <div className="standard-block">
      <div className="standard-header">
        <span className="standard-title">{standard.title}</span>
        <span className="badge badge-cfr">{standard.cfr}</span>
      </div>
      <div className="standard-desc">{standard.description}</div>
      <div className="spec-list">
        {standard.specs.map(spec => (
          <SpecItem key={spec.id} spec={spec} />
        ))}
      </div>
    </div>
  );
}
