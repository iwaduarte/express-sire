`${
  opts.esm
    ? `import express from 'express';
`
    : `const express = require('express');`
}
const router = express.Router();

router.get('/', (req, res) =>  res.json({ title: \`[Sire] Hello\`}));

${opts.esm ? 'export default router;' : 'module.exports = router;'}
`;
