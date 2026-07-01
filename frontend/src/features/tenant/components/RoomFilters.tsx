import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';

export const RoomFilters = () => {
  return (
    <Card className="border-border sticky top-4">
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6 pt-6">
        
        <div className="space-y-2">
          <Label className="text-muted-foreground font-semibold uppercase text-xs tracking-wider">AI Compatibility</Label>
          <div className="space-y-2 pt-1 text-sm font-medium">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="comp" className="accent-primary" /> Any Match
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="comp" className="accent-primary" /> 80%+ Match
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="comp" className="accent-primary" /> 90%+ Match
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="comp" className="accent-primary" /> 95%+ Match <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded ml-1">Best</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground font-semibold uppercase text-xs tracking-wider">Price Range ($)</Label>
          <div className="flex items-center gap-2 pt-1">
            <Input placeholder="Min" type="number" className="h-8" />
            <span className="text-muted-foreground">-</span>
            <Input placeholder="Max" type="number" className="h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground font-semibold uppercase text-xs tracking-wider">Room Type</Label>
          <div className="space-y-2 pt-1 text-sm font-medium">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-primary rounded" /> Private Room</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-primary rounded" /> Shared Room</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-primary rounded" /> Entire Apartment</label>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
