import {expect, test} from 'bun:test';
import {createStbl} from '../create/iso-base-media/create-stbl';
import {exampleVideoSamplePositions} from '../create/iso-base-media/example-stts';
import {createAvccBox} from '../create/iso-base-media/mdia/stbl/stsd/create-avcc';
import {createBtrt} from '../create/iso-base-media/mdia/stbl/stsd/create-btrt';
import {createPasp} from '../create/iso-base-media/mdia/stbl/stsd/create-pasp';

const sample = new Uint8Array([
	0, 0, 8, 145, 115, 116, 98, 108, 0, 0, 0, 197, 115, 116, 115, 100, 0, 0, 0, 0,
	0, 0, 0, 1, 0, 0, 0, 181, 97, 118, 99, 49, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 128, 1, 104, 0, 72, 0, 0, 0, 72, 0, 0,
	0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 255, 255, 0, 0, 0, 59, 97, 118, 99,
	67, 1, 100, 0, 30, 255, 225, 0, 30, 103, 100, 0, 30, 172, 217, 64, 160, 47,
	249, 112, 22, 224, 64, 64, 180, 160, 0, 0, 3, 0, 32, 0, 0, 7, 129, 226, 197,
	178, 192, 1, 0, 6, 104, 235, 224, 140, 178, 44, 253, 248, 248, 0, 0, 0, 0, 16,
	112, 97, 115, 112, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 20, 98, 116, 114, 116, 0,
	0, 0, 0, 0, 8, 184, 0, 0, 8, 184, 0, 0, 0, 0, 24, 115, 116, 116, 115, 0, 0, 0,
	0, 0, 0, 0, 1, 0, 0, 0, 120, 0, 0, 11, 184, 0, 0, 0, 40, 115, 116, 115, 115,
	0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 21, 0, 0, 0, 41, 0, 0, 0, 61, 0,
	0, 0, 81, 0, 0, 0, 101, 0, 0, 3, 128, 99, 116, 116, 115, 0, 0, 0, 0, 0, 0, 0,
	110, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 58, 152, 0, 0, 0, 1, 0, 0,
	23, 112, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0,
	35, 40, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 46, 224, 0, 0, 0, 2, 0,
	0, 11, 184, 0, 0, 0, 1, 0, 0, 35, 40, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1,
	0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 58, 152, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0,
	1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 46, 224, 0, 0, 0,
	2, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 35, 40, 0, 0,
	0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 35, 40, 0, 0, 0, 1, 0, 0, 11, 184, 0,
	0, 0, 3, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 35, 40, 0, 0, 0, 1, 0, 0, 11, 184,
	0, 0, 0, 1, 0, 0, 58, 152, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 0, 0,
	0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 58, 152, 0, 0, 0, 1, 0, 0, 23,
	112, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 35,
	40, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0,
	35, 40, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 2, 0, 0, 23, 112, 0, 0, 0, 1, 0,
	0, 58, 152, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0,
	0, 11, 184, 0, 0, 0, 1, 0, 0, 58, 152, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1,
	0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 2, 0, 0, 23, 112, 0, 0, 0, 1,
	0, 0, 46, 224, 0, 0, 0, 2, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 35, 40, 0, 0, 0,
	1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 35, 40, 0, 0,
	0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 46, 224, 0,
	0, 0, 2, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 58, 152,
	0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 11, 184,
	0, 0, 0, 1, 0, 0, 58, 152, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 0, 0,
	0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 58, 152, 0, 0, 0, 1, 0, 0, 23,
	112, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 23,
	112, 0, 0, 0, 1, 0, 0, 58, 152, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0,
	0, 0, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 58, 152, 0, 0, 0, 1, 0, 0,
	23, 112, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0,
	23, 112, 0, 0, 0, 1, 0, 0, 35, 40, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 2, 0,
	0, 23, 112, 0, 0, 0, 1, 0, 0, 58, 152, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1,
	0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 35, 40, 0, 0, 0, 1,
	0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 58, 152, 0, 0, 0,
	1, 0, 0, 23, 112, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0,
	1, 0, 0, 35, 40, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 35, 40, 0, 0, 0,
	1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 46, 224, 0, 0, 0, 2, 0, 0, 11, 184, 0, 0,
	0, 1, 0, 0, 35, 40, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 35, 40, 0, 0,
	0, 1, 0, 0, 11, 184, 0, 0, 0, 1, 0, 0, 35, 40, 0, 0, 0, 1, 0, 0, 11, 184, 0,
	0, 0, 1, 0, 0, 35, 40, 0, 0, 0, 1, 0, 0, 11, 184, 0, 0, 0, 40, 115, 116, 115,
	99, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 2, 0,
	0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 244, 115, 116, 115, 122, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 120, 0, 0, 30, 78, 0, 0, 12, 118, 0, 0, 6, 88, 0, 0, 3, 102, 0, 0, 2,
	226, 0, 0, 11, 254, 0, 0, 3, 26, 0, 0, 11, 220, 0, 0, 3, 185, 0, 0, 2, 211, 0,
	0, 13, 169, 0, 0, 3, 117, 0, 0, 10, 226, 0, 0, 21, 209, 0, 0, 11, 136, 0, 0,
	5, 158, 0, 0, 10, 7, 0, 0, 13, 159, 0, 0, 10, 129, 0, 0, 6, 243, 0, 0, 54,
	116, 0, 0, 15, 32, 0, 0, 5, 204, 0, 0, 15, 147, 0, 0, 6, 253, 0, 0, 15, 32, 0,
	0, 13, 193, 0, 0, 14, 115, 0, 0, 14, 228, 0, 0, 5, 180, 0, 0, 17, 151, 0, 0,
	7, 46, 0, 0, 4, 240, 0, 0, 4, 176, 0, 0, 13, 68, 0, 0, 9, 26, 0, 0, 4, 70, 0,
	0, 4, 175, 0, 0, 7, 72, 0, 0, 3, 136, 0, 0, 61, 1, 0, 0, 18, 142, 0, 0, 4, 82,
	0, 0, 9, 162, 0, 0, 11, 163, 0, 0, 21, 234, 0, 0, 7, 237, 0, 0, 2, 245, 0, 0,
	3, 76, 0, 0, 20, 46, 0, 0, 5, 116, 0, 0, 3, 49, 0, 0, 4, 116, 0, 0, 9, 119, 0,
	0, 9, 53, 0, 0, 12, 109, 0, 0, 4, 64, 0, 0, 3, 172, 0, 0, 7, 105, 0, 0, 3,
	228, 0, 0, 75, 172, 0, 0, 11, 57, 0, 0, 3, 226, 0, 0, 8, 119, 0, 0, 9, 75, 0,
	0, 3, 109, 0, 0, 2, 156, 0, 0, 5, 241, 0, 0, 7, 155, 0, 0, 3, 111, 0, 0, 2,
	28, 0, 0, 2, 117, 0, 0, 5, 157, 0, 0, 3, 114, 0, 0, 2, 44, 0, 0, 2, 21, 0, 0,
	3, 70, 0, 0, 3, 88, 0, 0, 1, 210, 0, 0, 2, 1, 0, 0, 76, 94, 0, 0, 7, 98, 0, 0,
	3, 108, 0, 0, 1, 236, 0, 0, 2, 81, 0, 0, 6, 121, 0, 0, 3, 157, 0, 0, 2, 128,
	0, 0, 3, 16, 0, 0, 5, 75, 0, 0, 6, 88, 0, 0, 3, 101, 0, 0, 5, 117, 0, 0, 5,
	92, 0, 0, 5, 150, 0, 0, 5, 101, 0, 0, 2, 209, 0, 0, 4, 32, 0, 0, 4, 136, 0, 0,
	3, 172, 0, 0, 77, 246, 0, 0, 9, 144, 0, 0, 4, 2, 0, 0, 2, 39, 0, 0, 1, 144, 0,
	0, 6, 195, 0, 0, 1, 130, 0, 0, 4, 141, 0, 0, 1, 149, 0, 0, 3, 218, 0, 0, 1,
	231, 0, 0, 1, 164, 0, 0, 3, 124, 0, 0, 1, 122, 0, 0, 3, 17, 0, 0, 1, 62, 0, 0,
	2, 117, 0, 0, 1, 45, 0, 0, 4, 199, 0, 0, 2, 48, 0, 0, 1, 232, 115, 116, 99,
	111, 0, 0, 0, 0, 0, 0, 0, 118, 0, 0, 22, 167, 0, 0, 78, 95, 0, 0, 88, 98, 0,
	0, 94, 146, 0, 0, 113, 45, 0, 0, 119, 149, 0, 0, 138, 14, 0, 0, 145, 21, 0, 0,
	154, 133, 0, 0, 174, 203, 0, 0, 181, 142, 0, 0, 199, 13, 0, 0, 224, 44, 0, 0,
	242, 81, 0, 0, 251, 61, 0, 1, 11, 225, 0, 1, 28, 206, 0, 1, 45, 236, 0, 1, 59,
	123, 0, 1, 117, 62, 0, 1, 138, 250, 0, 1, 148, 20, 0, 1, 170, 68, 0, 1, 180,
	143, 0, 1, 202, 76, 0, 1, 222, 169, 0, 1, 240, 107, 0, 2, 5, 235, 0, 2, 14,
	238, 0, 2, 39, 33, 0, 2, 49, 158, 0, 2, 61, 42, 0, 2, 69, 41, 0, 2, 89, 9, 0,
	2, 104, 192, 0, 2, 112, 84, 0, 2, 123, 160, 0, 2, 134, 54, 0, 2, 144, 91, 0,
	2, 208, 170, 0, 2, 233, 213, 0, 2, 244, 195, 0, 3, 1, 179, 0, 3, 19, 243, 0,
	3, 45, 43, 0, 3, 59, 181, 0, 3, 65, 248, 0, 3, 75, 225, 0, 3, 99, 93, 0, 3,
	111, 110, 0, 3, 121, 60, 0, 3, 128, 254, 0, 3, 145, 18, 0, 3, 157, 149, 0, 3,
	176, 159, 0, 3, 184, 45, 0, 3, 194, 118, 0, 3, 208, 123, 0, 3, 215, 174, 0, 4,
	41, 246, 0, 4, 56, 126, 0, 4, 66, 252, 0, 4, 78, 193, 0, 4, 94, 169, 0, 4,
	101, 100, 0, 4, 110, 157, 0, 4, 123, 43, 0, 4, 134, 20, 0, 4, 144, 32, 0, 4,
	149, 138, 0, 4, 158, 156, 0, 4, 167, 135, 0, 4, 177, 150, 0, 4, 186, 94, 0, 4,
	191, 194, 0, 4, 201, 164, 0, 4, 208, 75, 0, 4, 216, 185, 0, 4, 222, 9, 0, 5,
	49, 3, 0, 5, 59, 180, 0, 5, 69, 188, 0, 5, 78, 69, 0, 5, 83, 228, 0, 5, 96,
	250, 0, 5, 103, 229, 0, 5, 113, 2, 0, 5, 119, 96, 0, 5, 131, 72, 0, 5, 144,
	60, 0, 5, 150, 240, 0, 5, 163, 1, 0, 5, 171, 172, 0, 5, 183, 222, 0, 5, 192,
	146, 0, 5, 201, 255, 0, 5, 209, 110, 0, 5, 220, 146, 0, 5, 230, 219, 0, 6, 56,
	31, 0, 6, 72, 76, 0, 6, 79, 156, 0, 6, 88, 96, 0, 6, 93, 62, 0, 6, 106, 158,
	0, 6, 114, 188, 0, 6, 122, 152, 0, 6, 130, 201, 0, 6, 137, 242, 0, 6, 146,
	117, 0, 6, 151, 104, 0, 6, 161, 128, 0, 6, 166, 73, 0, 6, 175, 246, 0, 6, 183,
	209, 0, 6, 189, 148, 0, 6, 197, 94, 0, 6, 205, 115,
]);

test('Create a full stbl atom', () => {
	const privateData = new Uint8Array([
		0x01, 0x64, 0x00, 0x1e, 0xff, 0xe1, 0x00, 0x1e, 0x67, 0x64, 0x00, 0x1e,
		0xac, 0xd9, 0x40, 0xa0, 0x2f, 0xf9, 0x70, 0x16, 0xe0, 0x40, 0x40, 0xb4,
		0xa0, 0x00, 0x00, 0x03, 0x00, 0x20, 0x00, 0x00, 0x07, 0x81, 0xe2, 0xc5,
		0xb2, 0xc0, 0x01, 0x00, 0x06, 0x68, 0xeb, 0xe0, 0x8c, 0xb2, 0x2c, 0xfd,
		0xf8, 0xf8, 0x00,
	]);
	expect(
		createStbl({
			samplePositions: exampleVideoSamplePositions,
			avc1Data: {
				pasp: createPasp(1, 1),
				avccBox: createAvccBox(privateData),
				btrt: createBtrt({
					maxBitrate: 571392,
					avgBitrate: 571392,
				}),
				width: 640,
				height: 360,
				horizontalResolution: 72,
				verticalResolution: 72,
				compressorName: '',
				depth: 24,
			},
		}),
	).toEqual(sample);
});
