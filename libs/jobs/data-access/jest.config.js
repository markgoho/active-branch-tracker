module.exports = {
  name: 'jobs-data-access',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/jobs/data-access',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
