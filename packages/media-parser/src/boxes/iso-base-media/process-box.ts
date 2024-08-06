import type {BufferIterator} from '../../buffer-iterator';
import type {IsoBaseMediaBox, ParseResult} from '../../parse-result';
import type {BoxAndNext} from '../../parse-video';
import {parseEsds} from './esds/esds';
import {parseFtyp} from './ftyp';
import {parseMdhd} from './mdhd';
import {parseMoov} from './moov/moov';
import {parseMvhd} from './mvhd';
import {parseMebx} from './stsd/mebx';
import {parseStsd} from './stsd/stsd';
import {parseStts} from './stts/stts';
import {parseTkhd} from './tkhd';
import {parseTrak} from './trak/trak';

const getChildren = ({
	boxType,
	iterator,
	bytesRemainingInBox,
}: {
	boxType: string;
	iterator: BufferIterator;
	bytesRemainingInBox: number;
}) => {
	const parseChildren =
		boxType === 'mdia' ||
		boxType === 'minf' ||
		boxType === 'stbl' ||
		boxType === 'dims' ||
		boxType === 'wave' ||
		boxType === 'stsb';

	if (parseChildren) {
		const parsed = parseBoxes({
			iterator,
			maxBytes: bytesRemainingInBox,
			allowIncompleteBoxes: false,
			initialBoxes: [],
		});

		if (parsed.status === 'incomplete') {
			throw new Error('Incomplete boxes are not allowed');
		}

		return parsed.segments;
	}

	if (bytesRemainingInBox < 0) {
		throw new Error('Box size is too big ' + JSON.stringify({boxType}));
	}

	iterator.discard(bytesRemainingInBox);
	return [];
};

const processBox = ({
	iterator,
	allowIncompleteBoxes,
}: {
	iterator: BufferIterator;
	allowIncompleteBoxes: boolean;
}): BoxAndNext => {
	const fileOffset = iterator.counter.getOffset();
	const bytesRemaining = iterator.bytesRemaining();

	const boxSize = iterator.getFourByteNumber();
	if (boxSize === 0) {
		throw new Error(`Expected box size of not 0, got ${boxSize}`);
	}

	if (bytesRemaining < boxSize) {
		if (bytesRemaining >= 4) {
			const type = iterator.getByteString(4);
			iterator.counter.decrement(4);

			if (type === 'mdat') {
				const skipTo = fileOffset + boxSize;
				const bytesToSkip = skipTo - iterator.counter.getOffset();

				// If there is a huge mdat chunk, we can skip it because we don't need it for the metadata
				if (bytesToSkip > 1_000_000) {
					return {
						type: 'complete',
						box: {
							type: 'regular-box',
							boxType: 'mdat',
							children: [],
							boxSize,
							offset: fileOffset,
						},
						size: boxSize,
						skipTo: fileOffset + boxSize,
					};
				}
			}
		}

		iterator.counter.decrement(iterator.counter.getOffset() - fileOffset);
		if (allowIncompleteBoxes) {
			return {
				type: 'incomplete',
			};
		}

		throw new Error(
			`Expected box size of ${bytesRemaining}, got ${boxSize}. Incomplete boxes are not allowed.`,
		);
	}

	const boxType = iterator.getByteString(4);

	if (boxType === 'ftyp') {
		const box = parseFtyp({iterator, size: boxSize, offset: fileOffset});
		return {
			type: 'complete',
			box,
			size: boxSize,
			skipTo: null,
		};
	}

	if (boxType === 'mvhd') {
		const box = parseMvhd({iterator, offset: fileOffset, size: boxSize});

		return {
			type: 'complete',
			box,
			size: boxSize,
			skipTo: null,
		};
	}

	if (boxType === 'tkhd') {
		const box = parseTkhd({iterator, offset: fileOffset, size: boxSize});

		return {
			type: 'complete',
			box,
			size: boxSize,
			skipTo: null,
		};
	}

	if (boxType === 'stsd') {
		const box = parseStsd({iterator, offset: fileOffset, size: boxSize});

		return {
			type: 'complete',
			box,
			size: boxSize,
			skipTo: null,
		};
	}

	if (boxType === 'mebx') {
		const box = parseMebx({iterator, offset: fileOffset, size: boxSize});

		return {
			type: 'complete',
			box,
			size: boxSize,
			skipTo: null,
		};
	}

	if (boxType === 'moov') {
		const box = parseMoov({iterator, offset: fileOffset, size: boxSize});

		return {
			type: 'complete',
			box,
			size: boxSize,
			skipTo: null,
		};
	}

	if (boxType === 'trak') {
		const box = parseTrak({
			data: iterator,
			size: boxSize,
			offsetAtStart: fileOffset,
		});

		return {
			type: 'complete',
			box,
			size: boxSize,
			skipTo: null,
		};
	}

	if (boxType === 'stts') {
		const box = parseStts({
			data: iterator,
			size: boxSize,
			fileOffset,
		});

		return {
			type: 'complete',
			box,
			size: boxSize,
			skipTo: null,
		};
	}

	if (boxType === 'mdhd') {
		const box = parseMdhd({
			data: iterator,
			size: boxSize,
			fileOffset,
		});

		return {
			type: 'complete',
			box,
			size: boxSize,
			skipTo: null,
		};
	}

	if (boxType === 'esds') {
		const box = parseEsds({
			data: iterator,
			size: boxSize,
			fileOffset,
		});

		return {
			type: 'complete',
			box,
			size: boxSize,
			skipTo: null,
		};
	}

	const bytesRemainingInBox =
		boxSize - (iterator.counter.getOffset() - fileOffset);

	const children = getChildren({
		boxType,
		iterator,
		bytesRemainingInBox,
	});

	return {
		type: 'complete',
		box: {
			type: 'regular-box',
			boxType,
			boxSize,
			children,
			offset: fileOffset,
		},
		size: boxSize,
		skipTo: null,
	};
};

export const parseBoxes = ({
	iterator,
	maxBytes,
	allowIncompleteBoxes,
	initialBoxes,
}: {
	iterator: BufferIterator;
	maxBytes: number;
	allowIncompleteBoxes: boolean;
	initialBoxes: IsoBaseMediaBox[];
}): ParseResult => {
	const boxes: IsoBaseMediaBox[] = initialBoxes;
	const initialOffset = iterator.counter.getOffset();

	while (
		iterator.bytesRemaining() > 0 &&
		iterator.counter.getOffset() - initialOffset < maxBytes
	) {
		const result = processBox({
			iterator,
			allowIncompleteBoxes,
		});
		if (result.type === 'incomplete') {
			if (Number.isFinite(maxBytes)) {
				throw new Error('maxBytes must be Infinity for top-level boxes');
			}

			return {
				status: 'incomplete',
				segments: boxes,
				continueParsing: () => {
					return parseBoxes({
						iterator,
						maxBytes,
						allowIncompleteBoxes,
						initialBoxes: boxes,
					});
				},
				skipTo: null,
			};
		}

		boxes.push(result.box);

		if (result.skipTo !== null) {
			return {
				status: 'incomplete',
				segments: boxes,
				continueParsing: () => {
					return parseBoxes({
						iterator,
						maxBytes,
						allowIncompleteBoxes,
						initialBoxes: boxes,
					});
				},
				skipTo: result.skipTo,
			};
		}

		iterator.discardFirstBytes();
	}

	return {
		status: 'done',
		segments: boxes,
	};
};
