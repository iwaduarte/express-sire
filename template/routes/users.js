`${
  opts.esm
    ? `import express from 'express';
`
    : `const express = require('express');`
}
const router = express.Router();

router.get('/', (req, res) => res.json({ users: "WOW"}));

${opts.esm ? 'export default router;' : 'module.exports = router;'}
`;
