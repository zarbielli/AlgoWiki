import C2S from 'canvas2svg';

function isNumber(obj: any) {

    return obj != null && typeof obj === typeof 1 && !isNaN(obj);
}

function bufferCanvasImage(options: object, cy: any) {

    //disable usePaths temporarily
    const usePaths = cy.renderer().usePaths;
    cy.renderer().usePaths = () => { return false; }
    // flush path cache
    cy.elements().forEach(function (ele) {
        ele._private.rscratch.pathCacheKey = null;
        ele._private.rscratch.pathCache = null;
    });

    const renderer = cy.renderer();
    const eles = cy.mutableElements();
    const bb = eles.boundingBox();
    const ctrRect = renderer.findContainerClientCoords();
    let width = options.full ? Math.ceil(bb.w) : ctrRect[2];
    let height = options.full ? Math.ceil(bb.h) : ctrRect[3];
    const specdMaxDims = isNumber(options.maxWidth) || isNumber(options.maxHeight);
    const pxRatio = renderer.getPixelRatio();
    let scale = 1;

    if (options.scale !== undefined) {
        width *= options.scale;
        height *= options.scale;

        scale = options.scale;
    } else if (specdMaxDims) {
        let maxScaleW = Infinity;
        let maxScaleH = Infinity;

        if (isNumber(options.maxWidth)) {
            maxScaleW = scale * options.maxWidth / width;
        }

        if (isNumber(options.maxHeight)) {
            maxScaleH = scale * options.maxHeight / height;
        }

        scale = Math.min(maxScaleW, maxScaleH);

        width *= scale;
        height *= scale;
    }

    if (!specdMaxDims) {
        width *= pxRatio;
        height *= pxRatio;
        scale *= pxRatio;
    }

    let buffCxt = null;
    const buffCanvas = buffCxt = new C2S(width, height);

    // Rasterize the layers, but only if container has nonzero size
    if (width > 0 && height > 0) {

        buffCxt.clearRect(0, 0, width, height);

        // fill background
        if (options.bg) {
            buffCxt.globalCompositeOperation = 'destination-over';

            buffCxt.fillStyle = options.bg;
            buffCxt.fillRect(0, 0, width, height);
        }

        buffCxt.globalCompositeOperation = 'source-over';

        const zsortedEles = renderer.getCachedZSortedEles();

        if (options.full) { // draw the full bounds of the graph
            buffCxt.translate(-bb.x1 * scale, -bb.y1 * scale);
            buffCxt.scale(scale, scale);

            renderer.drawElements(buffCxt, zsortedEles);

            buffCxt.scale(1 / scale, 1 / scale);
            buffCxt.translate(bb.x1 * scale, bb.y1 * scale);
        } else { // draw the current view
            const pan = cy.pan();

            const translation = {
                x: pan.x * scale,
                y: pan.y * scale
            };

            scale *= cy.zoom();

            buffCxt.translate(translation.x, translation.y);
            buffCxt.scale(scale, scale);

            renderer.drawElements(buffCxt, zsortedEles);

            buffCxt.scale(1 / scale, 1 / scale);
            buffCxt.translate(-translation.x, -translation.y);
        }

    }

    // restore usePaths to default value
    cy.renderer().usePaths = usePaths;
    return buffCanvas;
};

function output(canvas: any) {
    return canvas.getSerializedSvg();
}

function svg(options: any, cy: any) {
    return output(bufferCanvasImage(options || {}, cy));
};

export default svg;