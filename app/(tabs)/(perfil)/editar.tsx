import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../services/firebase';
import { useRouter } from 'expo-router';
import { Image, Modal, Pressable } from 'react-native';
import { AVATARES } from '@/assets/utils/avatars'; // ajuste o caminho se necessário
import { Ionicons } from '@expo/vector-icons';

function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11); // Remove não numéricos e limita a 11 dígitos

  if (numbers.length < 3) {
    return numbers; // Se ainda digitando DDD
  }

  if (numbers.length <= 7) {
    return numbers.replace(/^(\d{2})(\d{1})/, '($1) $2'); // DDD + 9
  }

  if (numbers.length <= 11) {
    return numbers.replace(/^(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2 $3-$4'); // (DD) 9 XXXX-XXXX
  }

  return numbers;
}

export default function EditarPerfilScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [modalErro, setModalErro] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");

  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [fotoPerfil, setFotoPerfil] = useState("padrao");
  const [modalVisible, setModalVisible] = useState(false);

  const handlePhoneChange = (text: string) => {
    const formattedText = formatPhoneNumber(text);
    setPhoneNumber(formattedText);
  };

  useEffect(() => {
    async function fetchProfile() {
      if (user?.uid) {
        try {
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            setDisplayName(data.nome || user.displayName || '');
            setPhoneNumber(data.phoneNumber || '');
            setFotoPerfil(data.fotoPerfil || "padrao");
          } else {
            setDisplayName(user.displayName || ''); 
            setPhoneNumber('');
          }
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
        } finally {
          setLoading(false); 
        }
      }
    }
    fetchProfile();
  }, [user]);

  async function handleSave() {
    if (!displayName.trim()) {
      setMensagemModal("O nome não pode ficar vazio.");
      setModalErro(true);
      return;
    }
  
    try {
      setLoading(true);
  
      await setDoc(doc(db, 'usuarios', user!.uid), {
        uid: user!.uid,
        email: user!.email,
        nome: displayName,
        phoneNumber: phoneNumber,
        fotoPerfil: fotoPerfil, // 👈 salva o avatar escolhido
      });      
  
      setMensagemModal("Perfil atualizado com sucesso!");
      setModalSucesso(true); // ao fechar esse modal, você pode usar router.push se quiser
    } catch (error) {
      console.error(error);
      setMensagemModal("Não foi possível atualizar o perfil.");
      setModalErro(true);
    } finally {
      setLoading(false);
    }
  }
  

  if (loading) {
    return <ActivityIndicator size="large" color="#f90" style={{ marginVertical: 16 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.voltar} onPress={() => router.push("../(perfil)")}>
        <Ionicons name="arrow-back" size={28} color="#f90" />
      </TouchableOpacity>

      <Text style={styles.title}>Editar Perfil</Text>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.avatarContainer}>
        <Image
          source={
            fotoPerfil === "padrao"
              ? require('@/assets/images/avatares/padrao.png')
              : AVATARES.find(a => a.nome === fotoPerfil)?.path || require('@/assets/images/avatares/padrao.png')
          }
          style={styles.avatar}
        />
        <Text style={styles.avatarTexto}>Trocar Avatar</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#aaa"
        value={displayName}
        onChangeText={setDisplayName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="(DD) 9 XXXX-XXXX"
        placeholderTextColor="#aaa"
        value={formatPhoneNumber(phoneNumber)}
        onChangeText={(text) => setPhoneNumber(text)}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>

      <Modal transparent visible={modalErro} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalErro(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>❌ Erro</Text>
            <Text style={styles.modalMensagem}>{mensagemModal}</Text>
            <TouchableOpacity style={styles.modalBotao} onPress={() => setModalErro(false)}>
              <Text style={styles.modalBotaoTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal transparent visible={modalSucesso} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => {
          setModalSucesso(false);
          router.push('../(perfil)');
        }}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>✅ Sucesso</Text>
            <Text style={styles.modalMensagem}>{mensagemModal}</Text>
            <TouchableOpacity style={styles.modalBotao} onPress={() => {
              setModalSucesso(false);
              router.push('../(perfil)');
            }}>
              <Text style={styles.modalBotaoTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)} />

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha um Avatar</Text>

            <ScrollView>
              {Array.from(new Set(AVATARES.map(a => a.categoria))).map((categoria) => (
                <View key={categoria}>
                  <Text style={styles.categoriaTitulo}>{categoria}</Text>

                  {Array.from(new Set(
                    AVATARES.filter(a => a.categoria === categoria).map(a => a.subcategoria)
                  )).map((subcategoria) => (
                    <View key={subcategoria} style={{ marginBottom: 24 }}>
                      <Text style={styles.subcategoriaTitulo}>{subcategoria}</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {AVATARES.filter(a => a.categoria === categoria && a.subcategoria === subcategoria).map((avatar, idx) => (
                          <TouchableOpacity
                            key={idx}
                            onPress={() => {
                              setFotoPerfil(avatar.nome);
                            }}
                            style={{ alignItems: "center", marginRight: 16 }}
                          >
                            <Image
                              source={avatar.path}
                              style={[
                                styles.avatarOpcao,
                                fotoPerfil === avatar.nome && { borderColor: "#f90", borderWidth: 2 },
                              ]}
                            />
                            <Text style={styles.avatarNome}>{avatar.nome}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.modalBotao} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalBotaoTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },  
  categoriaTitulo: {
    color: "#f90",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 12,
    textAlign: "center",
  },
  
  subcategoriaTitulo: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 8,
  },
  
  avatarOpcao: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#333",
  },
  
  avatarNome: {
    textAlign: "center",
    color: "#ccc",
    fontSize: 12,
    marginTop: 4,
  },  
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#f90",
  },
  avatarTexto: {
    color: "#f90",
    marginTop: 8,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  voltar: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },  
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitulo: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMensagem: {
    color: "#ccc",
    fontSize: 15,
    marginBottom: 16,
    textAlign: "center",
  },
  modalBotao: {
    borderWidth: 1,
    borderColor: "#555",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  modalBotaoTexto: {
    color: "#f90",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },  
  container: {
    flexGrow: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f90',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    color: '#fff',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#f90',
    borderRadius: 8,
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
