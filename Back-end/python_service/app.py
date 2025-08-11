from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os, sys, json, subprocess, traceback, logging
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Adobe Hackathon PDF Processor",
    description="API for indexing and querying PDFs",
    version="1.0"
)

# Path to your Round 2 Solution
ROUND2_PATH = os.path.join(os.getcwd(), '..', 'Round_2_Solution')
if not os.path.exists(ROUND2_PATH):
    logger.error(f"Round 2 solution path not found: {ROUND2_PATH}")
    sys.exit(1)

sys.path.insert(0, ROUND2_PATH)

class IndexRequest(BaseModel):
    path: str

def validate_pdf_path(path: str) -> bool:
    """Ensure the path is valid and points to a PDF."""
    if not path.lower().endswith('.pdf'):
        return False
    return os.path.exists(path)

@app.get("/")
async def home():
    return {
        "status": "running",
        "endpoints": {
            "POST /index": "Index a PDF file",
            "GET /related": "Query related content in a PDF"
        }
    }

@app.post("/index")
async def index_pdf(req: IndexRequest):
    if not validate_pdf_path(req.path):
        raise HTTPException(status_code=400, detail="Invalid PDF path.")

    try:
        import solution as sol
        logger.info(f"Indexing PDF: {req.path}")

        for fn_name in ['create_index', 'generate_index', 'run', 'main', 'extract_structure']:
            if hasattr(sol, fn_name):
                fn = getattr(sol, fn_name)
                try:
                    result = fn(req.path)
                    return {
                        "status": "success",
                        "method": f"solution.{fn_name}",
                        "result": str(result)[:200]
                    }
                except Exception as e:
                    logger.warning(f"Function {fn_name} failed: {str(e)}")
                    continue

        solution_py = os.path.join(ROUND2_PATH, 'solution.py')
        if os.path.exists(solution_py):
            subprocess.run(
                ['python', solution_py, req.path],
                check=True,
                cwd=ROUND2_PATH
            )
            return {"status": "success", "method": "subprocess"}

        raise HTTPException(
            status_code=500,
            detail="No valid entry point found in solution.py."
        )

    except Exception as e:
        logger.error(f"Indexing failed: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal error: {str(e)}"
        )

@app.get("/related")
async def get_related(filePath: str, pageNum: int = 1):
    if not validate_pdf_path(filePath):
        raise HTTPException(status_code=400, detail="Invalid PDF path.")

    try:
        import solution as sol
        if hasattr(sol, 'find_related'):
            results = sol.find_related(filePath, pageNum)
            return {"results": results}

        idx_path = f"{filePath}.index.json"
        if os.path.exists(idx_path):
            with open(idx_path, 'r', encoding='utf-8') as f:
                idx = json.load(f)
            headings = idx.get('headings', [])[:3]
            return {
                "results": [
                    {
                        "id": h.get('id', h.get('title', '')),
                        "title": h.get('title', ''),
                        "page": h.get('page', 1),
                        "snippet": (h.get('text')[:260] if h.get('text') else '')
                    }
                    for h in headings
                ]
            }

        return {"results": []}

    except Exception as e:
        logger.error(f"Query failed: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal error: {str(e)}"
        )