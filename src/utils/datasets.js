const tf = require('@tensorflow/tfjs');


function spiralData(numExamples, noise) {
    let n = numExamples / 2;
    const X = tf.zeros([numExamples, 2], "float32").arraySync();
    const y = tf.zeros([numExamples, 1], "int32").flatten().arraySync();
    for (let i = 0; i < 2; i += 1) {
        let index = 0;
        let r = tf.linspace(0.5, 4.5, n).arraySync();
        let t = tf.add(
            tf.linspace(
                i * 2 * Math.PI / 2,
                (i + 2) * 2 * Math.PI / 2,
                n
            ),
            tf.randomUniform([n, 1], -noise, noise).flatten()
        ).arraySync();

        for (let ix = n * i; ix < n * (i + 1); ix += 1) {
            X[ix] = [r[index] * Math.sin(t[index]), r[index] * Math.cos(t[index])]
            y[ix] = i;
            index += 1;
        }
    }
    return [X, y];
}



function circleData(numSamples, noise) {
    let n = numSamples / 2;
    const X = tf.variable(tf.zeros([numSamples, 2], "float32"));
    const y = tf.variable(tf.zeros([numSamples, 1], "int32"));

    const r = 4.5;

    const inside_radius = tf.randomUniform([n, 1], 0, r * 0.5);
    const inside_angle = tf.randomUniform([n, 1], 0, 2 * Math.PI);
    let inside_x = tf.mul(inside_radius, tf.sin(inside_angle));
    let inside_y = tf.mul(inside_radius, tf.cos(inside_angle));
    let noise_x = tf.randomUniform([n, 1], -r * noise, r * noise);
    let noise_y = tf.randomUniform([n, 1], -r * noise, r * noise);

    inside_x = tf.add(inside_x, noise_x);
    inside_y = tf.add(inside_y, noise_y);

    const outside_radius = tf.randomUniform([n, 1], r * 0.7, r);
    const outside_angle = tf.randomUniform([n, 1], 0, 2 * Math.PI);
    let outside_x = tf.mul(outside_radius, tf.sin(outside_angle));
    let outside_y = tf.mul(outside_radius, tf.cos(outside_angle));
    noise_x = tf.randomUniform([n, 1], -r * noise, r * noise);
    noise_y = tf.randomUniform([n, 1], -r * noise, r * noise);

    outside_x = tf.add(outside_x, noise_x);
    outside_y = tf.add(outside_y, noise_y);

    let x_cor = tf.concat([inside_x, outside_x], 0);
    let y_cor = tf.concat([inside_y, outside_y], 0);

    X.assign(tf.concat([x_cor, y_cor], 1));
    y.assign(tf.concat([tf.zeros([n, 1], 'int32'), tf.ones([n, 1], 'int32')], 0));

    return [X.arraySync(), y.flatten().arraySync()];
}


function gaussianData(numSamples, noise) {
    const n = numSamples / 2;
    const positiveX = tf.randomNormal([n, 2], 2.5, noise, 'float32');
    const negativeX = tf.randomNormal([n, 2], -2.5, noise, 'float32');

    const positiveY = tf.zeros([n, 1], 'int32');
    const negativeY = tf.ones([n, 1], 'int32');

    const X = tf.concat([positiveX, negativeX], 0);
    const y = tf.concat([positiveY, negativeY], 0);
    return [X.arraySync(), y.flatten().arraySync()];
}


function xorData(numSamples, noise) {
    const n = numSamples / 2;

    let x = tf.randomUniform([numSamples, 1], -4, 4);
    let y = tf.randomUniform([numSamples, 1], -4, 4);

    const x_below_zero = x.less(0);
    const y_below_zero = y.less(0);

    let padding_x = tf.onesLike(x);
    let padding_y = tf.onesLike(y);
    padding_x = tf.mul(tf.where(x_below_zero, -1, padding_x), 0.3);
    padding_y = tf.mul(tf.where(y_below_zero, -1, padding_y), 0.3);


    x = tf.add(tf.add(x, padding_x), tf.randomUniform([n * 2, 1], -5 * noise, 5 * noise))
    y = tf.add(tf.add(y, padding_y), tf.randomUniform([n * 2, 1], -5 * noise, 5 * noise));

    let X = tf.concat([x, y], 1);

    let Y = tf.zeros([n * 2, 1], 'int32');
    let x_cor = X.slice([0, 0], [n * 2, 1]);
    let y_cor = X.slice([0, 1], [n * 2, 1]);

    let label = tf.greater(tf.mul(x_cor, y_cor), 0);

    Y = tf.where(label, 1, Y);

    return [X.arraySync(), Y.flatten().arraySync()];
}


module.exports = {spiralData, circleData, gaussianData, xorData};