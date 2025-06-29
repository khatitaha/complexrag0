"use client";

export default function PrintExam() {
    const questions = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        text: `Question ${i + 1}: Describe something in detail.`
    }));

    return (
        <div className="print:p-12 p-4 font-serif print:text-black print:bg-white">
            <button
                className="print:hidden mb-4 bg-blue-600 text-white p-2 rounded"
                onClick={() => window.print()}
            >
                Print
            </button>

            <div className="text-center mb-6">
                <h1 className="text-3xl">Midterm Examination</h1>
                <p className="text-sm">Date: ________ &nbsp; Name: ______________</p>
                <hr className="border border-black mt-2" />
            </div>

            <div className="space-y-6">
                {questions.map((q) => (
                    <div
                        key={q.id}
                        className="break-inside-avoid print:mb-6"
                    >
                        <p className="font-medium mb-2">{q.id}. {q.text}</p>
                        {[...Array(4)].map((_, idx) => (
                            <div key={idx} className="border-b border-black w-full h-5 mb-2" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

