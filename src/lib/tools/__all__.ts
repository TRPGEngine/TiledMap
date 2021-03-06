import type { BaseTool } from './BaseTool';
import { FreeBrush } from './FreeBrush';
import { TiledBrush } from './TiledBrush';
import { LineTool } from './LineTool';
import type { ToolManager } from './manager';
import { RectTool } from './RectTool';
import { CircleTool } from './CircleTool';
import { PolygonTool } from './PolygonTool';

interface ToolCls {
  toolName: string;

  new (toolManager: ToolManager): BaseTool;
}

const tools = new Set<ToolCls>();

function reg(toolCls: ToolCls) {
  tools.add(toolCls);
}

export function getAllTools(): ToolCls[] {
  return Array.from(tools.values());
}

reg(FreeBrush);
reg(TiledBrush);
reg(LineTool);
reg(RectTool);
reg(CircleTool);
reg(PolygonTool);
