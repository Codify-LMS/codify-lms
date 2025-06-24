package com.codify.codify_lms.service;

import com.codify.codify_lms.dto.QuizSubmissionRequest;
import com.codify.codify_lms.dto.QuizSubmissionResponse; // Import QuizSubmissionResponse
import com.codify.codify_lms.model.QuizQuestion;
import com.codify.codify_lms.model.UserAnswer;
import com.codify.codify_lms.model.UserQuizAttempt;
import com.codify.codify_lms.repository.QuizQuestionRepository;
import com.codify.codify_lms.repository.QuizRepository;
import com.codify.codify_lms.repository.UserAnswerRepository;
import com.codify.codify_lms.repository.UserQuizAttemptRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList; // Import ArrayList
import java.util.List; // Import List
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizSubmissionService {

    @Autowired
    private QuizRepository quizRepository; // AutoWired is fine here, or use final with constructor injection

    private final QuizQuestionRepository quizQuestionRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final UserQuizAttemptRepository userQuizAttemptRepository;

    @Transactional
    public QuizSubmissionResponse submitQuiz(QuizSubmissionRequest request) { // Mengembalikan QuizSubmissionResponse
        double totalScore = 0;
        List<QuizSubmissionResponse.AnswerResult> answerResults = new ArrayList<>(); // Untuk menyimpan hasil per pertanyaan

        // Inisialisasi awal UserQuizAttempt dengan data dasar dari request
        // Score dan isPassed akan diisi setelah perhitungan
        UserQuizAttempt newAttempt = UserQuizAttempt.builder()
                .userId(request.getUserId())
                .quizId(request.getQuizId())
                .attemptedAt(Instant.now())
                .build();

        // Simpan attempt awal untuk mendapatkan ID
        // Penting: Score dan isPassed belum di set, akan diupdate nanti
        UserQuizAttempt savedAttempt = userQuizAttemptRepository.save(newAttempt);

        // Debugging: Cek data request
        System.out.println("DEBUG: User ID: " + request.getUserId());
        System.out.println("DEBUG: Quiz ID: " + request.getQuizId());
        System.out.println("DEBUG: Number of answers: " + request.getAnswers().size());


        // Proses semua jawaban user
        for (QuizSubmissionRequest.AnswerRequest answer : request.getAnswers()) {
            QuizQuestion question = quizQuestionRepository.findById(answer.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found: " + answer.getQuestionId()));

            boolean isCorrect = false;
            double gainedScore = 0;

            // Logika penilaian berdasarkan tipe pertanyaan
            if ("multiple_choice".equalsIgnoreCase(question.getQuestionType())) {
                isCorrect = question.getCorrectAnswerIndex() != null
                        && question.getCorrectAnswerIndex().equals(answer.getSelectedAnswerIndex());
            } else { // Untuk 'essay' atau 'short_answer'
                // Pastikan perbandingan tidak peka huruf besar/kecil dan mengabaikan spasi
                isCorrect = question.getCorrectAnswerText() != null
                        && question.getCorrectAnswerText().trim().equalsIgnoreCase(
                                (answer.getWrittenAnswer() != null ? answer.getWrittenAnswer().trim() : "")
                        );
            }

            if (isCorrect) {
                gainedScore = question.getScoreValue();
                totalScore += gainedScore;
            }

            // Simpan jawaban user
            UserAnswer userAnswer = UserAnswer.builder()
                    .attemptId(savedAttempt.getId())
                    .questionId(question.getId())
                    .answerText("multiple_choice".equalsIgnoreCase(question.getQuestionType())
                            ? (answer.getSelectedAnswerIndex() != null ? String.valueOf(answer.getSelectedAnswerIndex()) : null)
                            : answer.getWrittenAnswer())
                    .isCorrect(isCorrect)
                    .scoreGained(gainedScore)
                    .submittedAt(OffsetDateTime.now(ZoneOffset.UTC))
                    .build();

            userAnswerRepository.save(userAnswer);

            // Tambahkan hasil pertanyaan ke list untuk response frontend
            answerResults.add(new QuizSubmissionResponse.AnswerResult(
                    question.getId(),
                    isCorrect,
                    question.getQuestionType().equalsIgnoreCase("multiple_choice") ? question.getCorrectAnswerIndex() : null,
                    !question.getQuestionType().equalsIgnoreCase("multiple_choice") ? question.getCorrectAnswerText() : null
            ));
            System.out.println("DEBUG: Question " + question.getId() + " - isCorrect: " + isCorrect + " - Gained Score: " + gainedScore);
        }

        // Dapatkan passing score
        double passingScore = getPassingScore(request.getQuizId());
        boolean isPassed = totalScore >= passingScore;

        // Debugging: Cek skor akhir dan status kelulusan
        System.out.println("DEBUG: Total Score: " + totalScore);
        System.out.println("DEBUG: Passing Score: " + passingScore);
        System.out.println("DEBUG: Is Passed: " + isPassed);

        // Update hasil quiz attempt dengan score dan status kelulusan yang sudah dihitung
        savedAttempt.setScoreObtained(totalScore);
        savedAttempt.setIsPassed(isPassed);
        savedAttempt.setUpdatedAt(OffsetDateTime.now(ZoneOffset.UTC));
        userQuizAttemptRepository.save(savedAttempt); // Simpan perubahan pada attempt

        // Mengembalikan QuizSubmissionResponse lengkap
        return new QuizSubmissionResponse(
                "Quiz submitted successfully!",
                (int) totalScore,
                isPassed,
                answerResults
        );
    }

    // Metode ini seharusnya mencari nilai pass_score langsung dari entitas Quiz
    private double getPassingScore(UUID quizId) {
        // Asumsi QuizRepository memiliki metode untuk mengambil kuis
        // Dan entitas Quiz memiliki field `passScore`
        // Jika tidak, Anda perlu menghitungnya dari total nilai soal dan persentase lulus
        return quizRepository.findById(quizId)
                .map(quiz -> quiz.getPassScore()) // Asumsi ada getPassScore() di model Quiz
                .orElse(80); // Default ke 80 jika tidak ditemukan, sesuai frontend
    }
}