import {
  getPlatformStats,
  listUsers,
  updateUserStatus,
  createAdmin,
  updateUserRole,
  getPendingEmployers,
  verifyEmployer,
  getPendingJobs,
  reviewJob,
  toggleJobFeatured,
  getAuditLogs,
} from "../controllers/adminController.js";
import { createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { createJob } from "../controllers/jobController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes below require admin or superadmin
router.use(authenticate, authorize("admin", "superadmin"));

router.get("/stats", getPlatformStats);
router.get("/users", listUsers);
router.route("/users/:id/status").patch(updateUserStatus).post(updateUserStatus);

router.get("/employers/pending", getPendingEmployers);
router.route("/employers/:id/verify").patch(verifyEmployer).post(verifyEmployer);

router.get("/jobs/pending", getPendingJobs);
router.route("/jobs/:id/review").patch(reviewJob).post(reviewJob);
router.route("/jobs/:id/featured").patch(toggleJobFeatured).post(toggleJobFeatured);
router.post("/jobs", createJob);

router.post("/categories", createCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/audit-logs", getAuditLogs);

// Super Admin only
router.post("/admins", authorize("superadmin"), createAdmin);
router.patch("/users/:id/role", authorize("superadmin"), updateUserRole);

export default router;
