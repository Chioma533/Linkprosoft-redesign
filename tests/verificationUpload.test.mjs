import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const previewUrl = new URL(
  "../src/components/verification/VerificationPreview.jsx",
  import.meta.url
);
const pageUrl = new URL(
  "../src/pages/verification/VerificationPage.jsx",
  import.meta.url
);
const hookUrl = new URL(
  "../src/hooks/verification/useVerification.js",
  import.meta.url
);
const constantsUrl = new URL(
  "../src/constants/verification.js",
  import.meta.url
);

test("identity preview exposes document upload and validation feedback", async () => {
  const [preview, page] = await Promise.all([
    readFile(previewUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  assert.match(preview, /type="file"/);
  assert.match(preview, /onUpload\(event\.target\.files\?\.\[0\]\)/);
  assert.match(preview, /accept="image\/jpeg,image\/png,image\/webp,application\/pdf"/);
  assert.match(preview, /Selected: \{uploadedFile\}/);
  assert.match(preview, /role="alert"/);
  assert.match(page, /documentFile=\{idDocumentFile\}/);
  assert.match(preview, /URL\.createObjectURL\(documentFile\)/);
  assert.match(preview, /URL\.revokeObjectURL\(previewUrl\)/);
  assert.match(preview, /<img[\s\S]*alt=\{`Preview of \$\{documentFile\.name\}`\}/);
  assert.match(preview, /<iframe[\s\S]*title=\{`Preview of \$\{documentFile\.name\}`\}/);
});

test("successful identity submission returns to the overview and unlocks step 2", async () => {
  const [hook, constants, page] = await Promise.all([
    readFile(hookUrl, "utf8"),
    readFile(constantsUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);
  const submitIdentity = hook.split("// Step 1: Submit Identity")[1].split("// Step 2: Submit Professional")[0];

  assert.match(constants, /PROFESSIONAL:\s*"professional"/);
  assert.match(constants, /"Identity",\s*"Professional",\s*"Face",\s*"Payment"/);
  assert.match(submitIdentity, /setCompletedSteps[\s\S]*"identity"/);
  assert.match(submitIdentity, /setHighestReachedStep[\s\S]*2/);
  assert.match(submitIdentity, /setView\(VERIFICATION_VIEWS\.OVERVIEW\)/);
  assert.match(page, /isLocked:\s*!isIdentityCompleted/);
});

test("payment card resumes face verification when face step is incomplete", async () => {
  const [hook, page] = await Promise.all([
    readFile(hookUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  assert.match(page, /isFaceCompleted = completedSteps\.includes\("face"\)/);
  assert.match(page, /continueFaceVerification = step === "payment" && !isFaceCompleted/);
  assert.match(page, /setView\(continueFaceVerification \? "face" : step\)/);
  assert.match(page, /continueFaceVerification\s*\?\s*"Continue Step"/);
  assert.match(hook, /canContinueToFace[\s\S]*completedSteps\.includes\("identity"\)[\s\S]*completedSteps\.includes\("professional"\)/);
});
