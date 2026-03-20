import _ from 'lodash';

import type { RawSymbol, SymbolState } from './types';

export const REEL_PADDING = 0.5;

// Vertical offset for symbols relative to the board frame. Negative = move up.
export const SYMBOL_Y_OFFSET = -40;

// initial board (padded top and bottom) - 6x4 grid, 6 symbols per reel (4 visible + 2 padding)
export const INITIAL_BOARD: RawSymbol[][] = [
	[{ name: 'L2' }, { name: 'L1' }, { name: 'H2' }, { name: 'L3' }, { name: 'H4' }, { name: 'L2' }],
	[{ name: 'H1' }, { name: 'L5' }, { name: 'H3' }, { name: 'L4' }, { name: 'L1' }, { name: 'H1' }],
	[{ name: 'L3' }, { name: 'L4' }, { name: 'H4' }, { name: 'H2' }, { name: 'L2' }, { name: 'L3' }],
	[{ name: 'H4' }, { name: 'L4' }, { name: 'L5' }, { name: 'H3' }, { name: 'L4' }, { name: 'H4' }],
	[{ name: 'H3' }, { name: 'L3' }, { name: 'H1' }, { name: 'L5' }, { name: 'H2' }, { name: 'L1' }],
	[{ name: 'L1' }, { name: 'H2' }, { name: 'L4' }, { name: 'H3' }, { name: 'L2' }, { name: 'H1' }],
];

export const BOARD_DIMENSIONS = { x: INITIAL_BOARD.length, y: INITIAL_BOARD[0].length - 2 };

// Board dimensions match the actual slot grid area in the sprite art (1634×1219 px within 2048×2048).
// BOARD_HEIGHT preserves the 1634:1219 aspect ratio so symbols align with the grid cells.
const BOARD_WIDTH_DESIGN = 600;
const BOARD_HEIGHT_DESIGN = Math.round(600 * (1219 / 1634)); // ≈ 448
// Scale the board down (e.g. 0.5 = half size). Tweak this to fit your layout.
export const BOARD_SCALE = 1;
export const BOARD_WIDTH = BOARD_WIDTH_DESIGN * BOARD_SCALE;
export const BOARD_HEIGHT = BOARD_HEIGHT_DESIGN * BOARD_SCALE;
export const BOARD_SIZES = { width: BOARD_WIDTH, height: BOARD_HEIGHT };

// Cell/symbol size derived from board for positioning and rendering
export const CELL_WIDTH = BOARD_WIDTH / BOARD_DIMENSIONS.x;
export const CELL_HEIGHT = BOARD_HEIGHT / BOARD_DIMENSIONS.y;

export const SYMBOL_SIZE = (CELL_WIDTH + CELL_HEIGHT) / 2.5;

export const BACKGROUND_RATIO = 2497 / 1500;
export const PORTRAIT_BACKGROUND_RATIO = 1242 / 2208;
const PORTRAIT_RATIO = 800 / 1422;
const LANDSCAPE_RATIO = 1600 / 900;
const DESKTOP_RATIO = 1422 / 800;

const DESKTOP_HEIGHT = 800;
const LANDSCAPE_HEIGHT = 900;
const PORTRAIT_HEIGHT = 1422;
export const DESKTOP_MAIN_SIZES = { width: DESKTOP_HEIGHT * DESKTOP_RATIO, height: DESKTOP_HEIGHT };
export const LANDSCAPE_MAIN_SIZES = {
	width: LANDSCAPE_HEIGHT * LANDSCAPE_RATIO,
	height: LANDSCAPE_HEIGHT,
};
export const PORTRAIT_MAIN_SIZES = {
	width: PORTRAIT_HEIGHT * PORTRAIT_RATIO,
	height: PORTRAIT_HEIGHT,
};

export const HIGH_SYMBOLS = ['H1', 'H2', 'H3', 'H4', 'H5'];

export const INITIAL_SYMBOL_STATE: SymbolState = 'static';

const HIGH_SYMBOL_SIZE = 0.9;
const LOW_SYMBOL_SIZE = 0.9;

const SPIN_OPTIONS_SHARED = {
	reelBounceBackSpeed: 0.15,
	reelSpinSpeedBeforeBounce: 4,
	reelPaddingMultiplierNormal: 1.2,
	reelPaddingMultiplierAnticipated: 10,
	reelSpinDelay: 145,
};

export const SPIN_OPTIONS_DEFAULT = {
	...SPIN_OPTIONS_SHARED,
	reelPreSpinSpeed: 2,
	reelSpinSpeed: 3,
	reelBounceSizeMulti: 0.3,
};

export const SPIN_OPTIONS_FAST = {
	...SPIN_OPTIONS_SHARED,
	reelPreSpinSpeed: 5,
	reelSpinSpeed: 5,
	reelBounceSizeMulti: 0.05,
};

export const MOTION_BLUR_VELOCITY = 31;

export const zIndexes = {
	background: {
		backdrop: -3,
		normal: -2,
		feature: -1,
	},
};

const explosion = {
	type: 'spine',
	assetKey: 'explosion',
	animationName: 'explosion',
	sizeRatios: { width: 1, height: 1 },
};

// Asset keys must match frame names in symbolsStatic/symbols.json
const h1Static = {
	type: 'sprite',
	assetKey: 'High_Symbol_Vegemite-removebg-preview.png',
	sizeRatios: { width: 1, height: 1 },
};
const h2Static = {
	type: 'sprite',
	assetKey: 'High_Symbol_Meat_Pie-removebg-preview.png',
	sizeRatios: { width: 1, height: 1 },
};
const h3Static = {
	type: 'sprite',
	assetKey: 'High_Symbol_Beer-removebg-preview.png',
	sizeRatios: { width: 1, height: 1 },
};
const h4Static = {
	type: 'sprite',
	assetKey: 'High_Symbol_Boomerang_-removebg-preview.png',
	sizeRatios: { width: 1, height: 1 },
};
const h5Static = {
	type: 'sprite',
	assetKey: 'High_Symbol_Gove-removebg-preview.png',
	sizeRatios: { width: 1, height: 1 },
};

const l1Static = {
	type: 'sprite',
	assetKey: 'Low_Symbol_A-removebg-preview.png',
	sizeRatios: { width: 1, height: 1 },
};
const l2Static = {
	type: 'sprite',
	assetKey: 'Low_Symbol_K-removebg-preview.png',
	sizeRatios: { width: 1, height: 1 },
};
const l3Static = {
	type: 'sprite',
	assetKey: 'Low_Symbol_Q-removebg-preview.png',
	sizeRatios: { width: 1, height: 1 },
};
const l4Static = {
	type: 'sprite',
	assetKey: 'Low_Symbol_J-removebg-preview.png',
	sizeRatios: { width: 1, height: 1 },
};
const l5Static = {
	type: 'sprite',
	assetKey: 'Low_Symbol_10-removebg-preview.png',
	sizeRatios: { width: 1, height: 1 },
};

const sStatic = {
	type: 'sprite',
	assetKey: 'Scatter-removebg-preview.png',
	sizeRatios: { width: 1, height: 1 },
};
const wStatic = {
	type: 'sprite',
	assetKey: 'Wild-removebg-preview.png',
	sizeRatios: { width: 1, height: 1 },
};

export const SYMBOL_INFO_MAP = {
	H1: {
		explosion,
		win: {
			type: 'spine',
			assetKey: 'H1',
			animationName: 'h1',
			sizeRatios: { width: 0.5 * 1.15, height: HIGH_SYMBOL_SIZE * 0.57 },
		},
		postWinStatic: h1Static,
		static: h1Static,
		spin: h1Static,
		land: h1Static,
	},
	H2: {
		explosion,
		win: {
			type: 'spine',
			assetKey: 'H2',
			animationName: 'h2',
			sizeRatios: { width: 0.5, height: HIGH_SYMBOL_SIZE * 0.57 },
		},
		postWinStatic: h2Static,
		static: h2Static,
		spin: h2Static,
		land: h2Static,
	},
	H3: {
		explosion,
		win: {
			type: 'spine',
			assetKey: 'H3',
			animationName: 'h3',
			sizeRatios: { width: 0.5 * 0.9, height: HIGH_SYMBOL_SIZE * 0.53 },
		},
		postWinStatic: h3Static,
		static: h3Static,
		spin: h3Static,
		land: h3Static,
	},
	H4: {
		explosion,
		win: {
			type: 'spine',
			assetKey: 'H4',
			animationName: 'h4',
			sizeRatios: { width: 0.5 * 0.9, height: HIGH_SYMBOL_SIZE * 0.53 },
		},
		postWinStatic: h4Static,
		static: h4Static,
		spin: h4Static,
		land: h4Static,
	},
	H5: {
		explosion,
		win: {
			type: 'spine',
			assetKey: 'H5',
			animationName: 'h5',
			sizeRatios: { width: 0.5 * 0.9, height: HIGH_SYMBOL_SIZE * 0.53 },
		},
		postWinStatic: h5Static,
		static: h5Static,
		spin: h5Static,
		land: h5Static,
	},
	L1: {
		explosion,
		win: {
			type: 'spine',
			assetKey: 'L1',
			animationName: 'l1',
			sizeRatios: { width: 0.5 * 0.75, height: LOW_SYMBOL_SIZE * 0.65 },
		},
		postWinStatic: l1Static,
		static: l1Static,
		spin: l1Static,
		land: l1Static,
	},
	L2: {
		explosion,
		win: {
			type: 'spine',
			assetKey: 'L2',
			animationName: 'l2',
			sizeRatios: { width: 0.5 * 0.75, height: LOW_SYMBOL_SIZE * 0.65 },
		},
		postWinStatic: l2Static,
		static: l2Static,
		spin: l2Static,
		land: l2Static,
	},
	L3: {
		explosion,
		win: {
			type: 'spine',
			assetKey: 'L3',
			animationName: 'l3',
			sizeRatios: { width: 0.5 * 0.75, height: LOW_SYMBOL_SIZE * 0.63 },
		},
		postWinStatic: l3Static,
		static: l3Static,
		spin: l3Static,
		land: l3Static,
	},
	L4: {
		explosion,
		win: {
			type: 'spine',
			assetKey: 'L4',
			animationName: 'l4',
			sizeRatios: { width: 0.5 * 0.75, height: LOW_SYMBOL_SIZE * 0.63 },
		},
		postWinStatic: l4Static,
		static: l4Static,
		spin: l4Static,
		land: l4Static,
	},
	L5: {
		explosion,
		win: l5Static,
		postWinStatic: l5Static,
		static: l5Static,
		spin: l5Static,
		land: l5Static,
	},
	W: {
		explosion,
		postWinStatic: {
			type: 'sprite',
			assetKey: 'Gold_Pouch-removebg-preview.png',
			sizeRatios: { width: 1, height: 1 },
		},
		static: wStatic,
		spin: wStatic,
		win: wStatic,
		land: wStatic,
	},
	S: {
		explosion,
		postWinStatic: sStatic,
		static: sStatic,
		spin: sStatic,
		win: sStatic,
		land: sStatic,
	},
} as const;

export const SCATTER_LAND_SOUND_MAP = {
	1: 'sfx_scatter_stop_1',
	2: 'sfx_scatter_stop_2',
	3: 'sfx_scatter_stop_3',
	4: 'sfx_scatter_stop_4',
	5: 'sfx_scatter_stop_5',
} as const;
